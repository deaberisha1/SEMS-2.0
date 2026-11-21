import { Router } from "express";
import crypto from "node:crypto";
import { StudentData, ProfessorData, Consultation, Request, Certificate } from "../models/index.js";
import { CERTIFICATE_TYPES, CERTIFICATE_LANGUAGES } from "../models/Certificate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { isEmail, isPhone, isIban, isText, isOptionalText, isPlainObject, validationError } from "../middleware/validate.js";

const router = Router();
router.use(requireAuth, requireRole("student"));

const newId = (prefix) => `${prefix}-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
const today = () => new Date().toLocaleDateString("en-GB").replaceAll("/", ".");

const PROFESSOR_TYPES = ["Rivlerësim", "Ankesa"];

const RULES = {
  "Rivlerësim": (d) =>
    !isText(d.lenda, { min: 1, max: 150 }) ? ["lenda", "Zgjidhni lëndën."]
    : !isText(d.arsyeja, { min: 1, max: 500 }) ? ["arsyeja", "Shkruani arsyen e rivlerësimit."]
    : null,
  "Ankesa": (d) =>
    !isText(d.titulli, { min: 1, max: 150 }) ? ["titulli", "Shkruani titullin."]
    : null,
  "Bursë": (d) =>
    !isText(d.banka, { min: 1, max: 100 }) ? ["banka", "Zgjidhni bankën."]
    : !isIban(d.iban) ? ["iban", "IBAN duhet të jetë në formatin XK + 18 shifra."]
    : !isText(d.arsyeja, { min: 10, max: 2000 }) ? ["arsyeja", "Arsyeja duhet të ketë së paku 10 karaktere."]
    : !Array.isArray(d.dokumentet) || d.dokumentet.length === 0 ? ["dokumentet", "Ngarkoni vërtetimin e regjistrimit."]
    : null,
  "Kartelë e re": (d) =>
    !isText(d.reason, { min: 1, max: 100 }) ? ["reason", "Zgjidhni arsyen."]
    : d.phone && !isPhone(d.phone) ? ["phone", "Numri i telefonit nuk është valid."]
    : null,
  "Transferim i notave": (d) =>
    !Array.isArray(d.courses) || d.courses.length === 0 || d.courses.length > 20 ? ["courses", "Zgjidhni lëndët për transferim."]
    : null,
  "QEQ": () => null,
  "Çregjistrim": () => null,
};

function textsTooLong(value) {
  if (typeof value === "string") return value.length > 2000;
  if (Array.isArray(value)) return value.length > 20 || value.some(textsTooLong);
  if (isPlainObject(value)) return Object.values(value).some(textsTooLong);
  return !(typeof value === "number" || typeof value === "boolean" || value === null);
}

async function professorFor(course) {
  if (course) {
    const prof = await ProfessorData.findOne({ "courses.name": course }).select("userId").lean();
    if (prof) return prof.userId;
  }
  return process.env.DEFAULT_PROFESSOR_ID || "000";
}

router.get("/data", async (req, res) => {
  const student = await StudentData.findOne({ userId: req.user.id }).lean();
  if (!student) return res.status(404).json({ error: "Të dhënat nuk u gjetën." });
  const consultations = await Consultation.find({ studentId: req.user.id })
    .sort({ createdAt: -1 })
    .select("-studentId -_id")
    .lean();
  const { _id, userId, ...rest } = student;
  res.json({ ...rest, consultations });
});

router.post("/consultations", async (req, res) => {
  const { prof, subject, date, slot, room, reason } = req.body || {};
  if (!isText(prof, { min: 1, max: 100 }) || !isText(date, { min: 1, max: 30 }) || !isText(slot, { min: 1, max: 20 })) {
    return validationError(res, "slot", "Zgjidhni datën dhe orarin.");
  }
  if (!isOptionalText(subject, 150) || !isOptionalText(room, 50) || !isOptionalText(reason, 1000)) {
    return validationError(res, "reason", "Të dhënat nuk janë valide.");
  }
  try {
    const booking = await Consultation.create({
      id: newId("KSL"),
      studentId: req.user.id,
      prof, subject, date, slot, room, reason,
      status: "Në pritje",
    });
    const { studentId, _id, ...result } = booking.toObject();
    res.status(201).json(result);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Ky orar është i zënë. Zgjidhni një orar tjetër." });
    }
    throw err;
  }
});

router.delete("/consultations/:id", async (req, res) => {
  const result = await Consultation.findOneAndDelete({
    id: req.params.id,
    studentId: req.user.id,
  });
  if (!result) return res.status(404).json({ error: "Kërkesa nuk u gjet." });
  res.json({ ok: true });
});

router.get("/requests", async (req, res) => {
  const requests = await Request.find({ studentId: req.user.id })
    .sort({ createdAt: -1 })
    .select("-_id")
    .lean();
  res.json(requests);
});

router.post("/requests", async (req, res) => {
  const { type, details = {} } = req.body || {};
  const rule = RULES[type];
  if (!rule) return validationError(res, "type", "Lloji i kërkesës nuk është valid.");
  if (!isPlainObject(details) || textsTooLong(details)) {
    return validationError(res, "details", "Të dhënat e kërkesës nuk janë valide.");
  }
  const problem = rule(details);
  if (problem) return validationError(res, problem[0], problem[1]);

  const course = details.lenda || undefined;
  const student = await StudentData.findOne({ userId: req.user.id }).select("profile").lean();
  const request = await Request.create({
    id: newId("KRK"),
    studentId: req.user.id,
    studentNumber: student?.profile?.studentNumber,
    studentName: req.user.name,
    type,
    course,
    date: today(),
    reason: details.arsyeja || details.titulli || details.reason,
    detail: details.detaje || details.pershkrim || details.description,
    details,
    status: "Në pritje",
    assignedTo: PROFESSOR_TYPES.includes(type) ? await professorFor(course) : "administrata",
  });
  const { _id, ...result } = request.toObject();
  res.status(201).json(result);
});

router.get("/certificates", async (req, res) => {
  const certs = await Certificate.find({ studentId: req.user.id })
    .sort({ createdAt: -1 })
    .select("-_id")
    .lean();
  res.json(certs);
});

router.post("/certificates", async (req, res) => {
  const { lloji, gjuha, arsyeja = "" } = req.body || {};
  if (!CERTIFICATE_TYPES.includes(lloji)) return validationError(res, "lloji", "Zgjidhni llojin e vërtetimit.");
  if (!CERTIFICATE_LANGUAGES.includes(gjuha)) return validationError(res, "gjuha", "Zgjidhni gjuhën.");
  if (!isOptionalText(arsyeja, 300)) return validationError(res, "arsyeja", "Qëllimi është shumë i gjatë.");
  const cert = await Certificate.create({
    id: newId("VRT"),
    studentId: req.user.id,
    lloji,
    gjuha,
    arsyeja,
  });
  const { _id, ...result } = cert.toObject();
  res.status(201).json(result);
});

router.patch("/profile", async (req, res) => {
  const { emailPersonal, telefon, adresa } = req.body || {};
  if (emailPersonal !== undefined && !isEmail(emailPersonal)) {
    return validationError(res, "emailPersonal", "Email-i nuk është valid.");
  }
  if (telefon !== undefined && !isPhone(telefon)) {
    return validationError(res, "telefon", "Numri i telefonit nuk është valid.");
  }
  if (adresa !== undefined && !isText(adresa, { min: 3, max: 200 })) {
    return validationError(res, "adresa", "Adresa duhet të ketë 3 deri në 200 karaktere.");
  }
  const doc = await StudentData.findOne({ userId: req.user.id });
  if (!doc) return res.status(404).json({ error: "Të dhënat nuk u gjetën." });
  if (emailPersonal !== undefined) doc.profile.emailPersonal = emailPersonal;
  if (telefon !== undefined) doc.profile.telefon = telefon;
  if (adresa !== undefined) doc.profile.adresa = adresa;
  doc.markModified("profile");
  await doc.save();
  res.json({ ok: true, profile: doc.profile });
});

export default router;
