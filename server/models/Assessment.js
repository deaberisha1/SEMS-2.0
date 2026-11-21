import { Schema, model } from "mongoose";

export const MAXES = { kuiz: 10, p1: 20, p2: 20, k1: 25, k2: 25 };

const assessmentSchema = new Schema(
  {
    courseId: { type: String, required: true },
    studentId: { type: String, required: true },
    kuiz: { type: Number, min: 0, max: MAXES.kuiz, default: 0 },
    p1: { type: Number, min: 0, max: MAXES.p1, default: 0 },
    p2: { type: Number, min: 0, max: MAXES.p2, default: 0 },
    k1: { type: Number, min: 0, max: MAXES.k1, default: 0 },
    k2: { type: Number, min: 0, max: MAXES.k2, default: 0 },
    updatedBy: String,
  },
  { versionKey: false, timestamps: true },
);

assessmentSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

export default model("Assessment", assessmentSchema);
