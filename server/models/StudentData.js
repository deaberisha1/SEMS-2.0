import { Schema, model } from "mongoose";

const list = { type: [Schema.Types.Mixed], default: [] };
const map = { type: Schema.Types.Mixed, default: {} };

const studentDataSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    profile: map,
    upcomingExams: list,
    recentGrades: list,
    notifications: list,
    transcript: list,
    schedule: list,
    paymentHistory: list,
    courses: list,
    examCourses: list,
    consultationProfessors: list,
    bookedSlots: map,
    attendanceSemesters: list,
    attendanceCourses: list,
    attendanceSummary: list,
    attendanceLogs: map,
  },
  { versionKey: false, minimize: false, strict: "throw" },
);

export default model("StudentData", studentDataSchema);
