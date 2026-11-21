import { Schema, model } from "mongoose";

const gradeSchema = new Schema(
  {
    courseId: { type: String, required: true },
    studentId: { type: String, required: true },
    exam: { type: Number, min: 0, max: 100, required: true },
    override: { type: Number, min: 5, max: 10, default: null },
    final: { type: Number, min: 5, max: 10, required: true },
    publishedBy: String,
    publishedAt: Date,
  },
  { versionKey: false, timestamps: true },
);

gradeSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

export default model("Grade", gradeSchema);
