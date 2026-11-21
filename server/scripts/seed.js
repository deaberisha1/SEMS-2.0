import "../env.js";
import mongoose from "mongoose";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "../db.js";
import {
  User,
  Session,
  StudentData,
  ProfessorData,
  Consultation,
  Request,
  Assessment,
  Grade,
  Certificate,
} from "../models/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const read = async (name) =>
  JSON.parse(await fs.readFile(path.join(__dirname, "..", "data", `${name}.json`), "utf8"));

await connectDB();

if ((await User.countDocuments()) > 0 && !process.argv.includes("--reset")) {
  console.error("Databaza ka të dhëna. Për t'i fshirë dhe për ta mbushur nga fillimi: npm run seed -- --reset");
  await mongoose.disconnect();
  process.exit(1);
}

const models = [User, Session, StudentData, ProfessorData, Consultation, Request, Assessment, Grade, Certificate];
await Promise.all(models.map((m) => m.deleteMany({})));
await Promise.all(models.map((m) => m.syncIndexes()));

await User.insertMany(await read("users"));

const studentData = await read("student");
await StudentData.create({ userId: "111", ...studentData });
const studentNumber = studentData.profile.studentNumber;

const { requests = [], ...profRest } = await read("professor");
await ProfessorData.create({ userId: "000", ...profRest });
await Request.insertMany(
  requests.map((r) => ({
    ...r,
    studentId: r.studentId === studentNumber ? "111" : r.studentId,
    studentNumber: r.studentId,
    assignedTo: "000",
  })),
);

const consultations = await read("consultations");
if (consultations.length > 0) await Consultation.insertMany(consultations);

console.log("\nSeed complete:");
for (const m of models) console.log(`  ${m.modelName}: ${await m.countDocuments()}`);

await mongoose.disconnect();
