import { Schema, model } from "mongoose";

const consultationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, index: true },
    prof: { type: String, required: true },
    subject: String,
    date: { type: String, required: true },
    slot: { type: String, required: true },
    room: String,
    reason: String,
    status: {
      type: String,
      enum: ["Në pritje", "Aprovuar", "Refuzuar"],
      default: "Në pritje",
    },
  },
  { versionKey: false, timestamps: true },
);

consultationSchema.index({ prof: 1, date: 1, slot: 1 }, { unique: true });

export default model("Consultation", consultationSchema);
