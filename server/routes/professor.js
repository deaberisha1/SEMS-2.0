import { Router } from "express";
import { ProfessorData, Request, Assessment, Grade } from "../models/index.js";
import { MAXES } from "../models/Assessment.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { isEmail, isPhone, isText, isOptionalText, inRange, validationError } from "../middleware/validate.js";

const router = Router();
router.use(requireAuth, requireRole("professor"));

const LABELS = { kuiz: "Kuizi", p1: "Projekti 1", p2: "Projekti 2", k1: "Kolokfiumi 1", k2: "Kolokfiumi 2" };

export function gradeFor(exam) {
  if (exam < 51) return 5;
  if (exam <= 60) return 6;
  if (exam <= 70) return 7;
  if (exam <= 80) return 8;
  if (exam <= 90) return 9;
  return 10;
}

async function courseStudents(req, res, courseId) {
  if (!isText(courseId, { min: 1, max: 50 })) {
    validationError(res, "courseId", "Zgjidhni lëndën.");
    return null;
  }
  const prof = await ProfessorData.findOne({ userId: req.user.id }).lean();
  if (!prof || !prof.courses.some((c) => c.id === courseId)) {
    res.status(403).json({ error: "Nuk e jepni këtë lëndë." });
    return null;
  }
  return new Set((prof.studentsByCourse?.[courseId] || []).map((s) => s.studentId));
}

const myRequests = (userId) =>
  Request.find({ assignedTo: userId }).sort({ createdAt: -1 }).select("-_id").lean();

router.get("/data", async (req, res) => {
  const prof = await ProfessorData.findOne({ userId: req.user.id }).lean();
  if (!prof) return res.status(404).json({ error: "Të dhënat nuk u gjetën." });
  const { _id, userId, ...rest } = prof;
  res.json({ ...rest, requests: await myRequests(req.user.id) });
});

router.get("/requests", async (req, res) => {
  res.json(await myRequests(req.user.id));
});

router.patch("/requests/:id", async (req, res) => {
  const { status, note } = req.body || {};
  if (!["Aprovuar", "Refuzuar"].includes(status)) {
    return validationError(res, "status", "Statusi duhet të jetë Aprovuar ose Refuzuar.");
  }
  if (!isOptionalText(note, 1000)) return validationError(res, "note", "Shënimi është shumë i gjatë.");
  const update = { status, decidedAt: new Date() };
  if (note) update.note = note;
  const request = await Request.findOneAndUpdate(
    { id: req.params.id, assignedTo: req.user.id, status: "Në pritje" },
    update,
    { new: true },
  ).select("-_id").lean();
  if (!request) {
    const exists = await Request.exists({ id: req.params.id, assignedTo: req.user.id });
    return exists
      ? res.status(409).json({ error: "Për këtë kërkesë është vendosur tashmë." })
      : res.status(404).json({ error: "Kërkesa nuk u gjet." });
  }
  res.json(request);
});

router.get("/assessments", async (req, res) => {
  const { courseId } = req.query;
  if (!(await courseStudents(req, res, courseId))) return;
  res.json(await Assessment.find({ courseId }).select("-_id").lean());
});

router.post("/assessments", async (req, res) => {
  const { courseId, rows } = req.body || {};
  const students = await courseStudents(req, res, courseId);
  if (!students) return;
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > 500) {
    return validationError(res, "rows", "Nuk ka rreshta për ruajtje.");
  }
  for (const [i, r] of rows.entries()) {
    if (!students.has(r?.studentId)) {
      return validationError(res, "studentId", `Rreshti ${i + 1}: studenti nuk është në këtë lëndë.`);
    }
    for (const [key, max] of Object.entries(MAXES)) {
      if (!inRange(r[key], 0, max)) {
        return validationError(res, key, `Rreshti ${i + 1}: ${LABELS[key]} duhet të jetë nga 0 deri në ${max}.`);
      }
    }
  }
  await Assessment.bulkWrite(
    rows.map((r) => ({
      updateOne: {
        filter: { courseId, studentId: r.studentId },
        update: { $set: { courseId, studentId: r.studentId, kuiz: r.kuiz, p1: r.p1, p2: r.p2, k1: r.k1, k2: r.k2, updatedBy: req.user.id } },
        upsert: true,
      },
    })),
  );
  res.json({ saved: rows.length });
});

router.get("/grades", async (req, res) => {
  const { courseId } = req.query;
  if (!(await courseStudents(req, res, courseId))) return;
  res.json(await Grade.find({ courseId }).select("-_id").lean());
});

router.post("/grades", async (req, res) => {
  const { courseId, grades } = req.body || {};
  const students = await courseStudents(req, res, courseId);
  if (!students) return;
  if (!Array.isArray(grades) || grades.length === 0 || grades.length > 500) {
    return validationError(res, "grades", "Nuk ka nota për publikim.");
  }
  for (const [i, g] of grades.entries()) {
    if (!students.has(g?.studentId)) {
      return validationError(res, "studentId", `Rreshti ${i + 1}: studenti nuk është në këtë lëndë.`);
    }
    if (!inRange(g.exam, 0, 100)) {
      return validationError(res, "exam", `Rreshti ${i + 1}: pikët e provimit duhet të jenë nga 0 deri në 100.`);
    }
    if (g.override != null && !(Number.isInteger(g.override) && inRange(g.override, 5, 10))) {
      return validationError(res, "override", `Rreshti ${i + 1}: nota manuale duhet të jetë nga 5 deri në 10.`);
    }
  }
  const now = new Date();
  await Grade.bulkWrite(
    grades.map((g) => ({
      updateOne: {
        filter: { courseId, studentId: g.studentId },
        update: {
          $set: {
            courseId,
            studentId: g.studentId,
            exam: g.exam,
            override: g.override ?? null,
            final: g.override ?? gradeFor(g.exam),
            publishedBy: req.user.id,
            publishedAt: now,
          },
        },
        upsert: true,
      },
    })),
  );
  res.json({ published: grades.length });
});

router.patch("/profile", async (req, res) => {
  const { emailPersonal, phone, office, consultations } = req.body || {};
  if (emailPersonal !== undefined && !isEmail(emailPersonal)) {
    return validationError(res, "emailPersonal", "Email-i nuk është valid.");
  }
  if (phone !== undefined && !isPhone(phone)) {
    return validationError(res, "phone", "Numri i telefonit nuk është valid.");
  }
  if (office !== undefined && !isText(office, { min: 1, max: 50 })) {
    return validationError(res, "office", "Shkruani zyrën.");
  }
  if (consultations !== undefined && !isText(consultations, { min: 1, max: 100 })) {
    return validationError(res, "consultations", "Shkruani orarin e konsultimeve.");
  }
  const doc = await ProfessorData.findOne({ userId: req.user.id });
  if (!doc) return res.status(404).json({ error: "Të dhënat nuk u gjetën." });
  const profile = { ...doc.profile };
  if (emailPersonal !== undefined) profile.emailPersonal = emailPersonal;
  if (phone !== undefined) profile.phone = phone;
  if (office !== undefined) profile.office = office;
  if (consultations !== undefined) profile.consultations = consultations;
  doc.profile = profile;
  doc.markModified("profile");
  await doc.save();
  res.json({ ok: true, profile });
});

export default router;
