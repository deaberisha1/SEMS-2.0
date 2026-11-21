import { Schema, model } from "mongoose";

export const REQUEST_TYPES = [
  "Kartelë e re",
  "Transferim i notave",
  "Rivlerësim",
  "Ankesa",
  "Konsultime",
  "Bursë",
  "QEQ",
  "Çregjistrim",
];

const requestSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, index: true },
    studentNumber: String,
    studentName: String,
    type: { type: String, required: true, enum: REQUEST_TYPES },
    course: String,
    date: String,
    slot: String,
    reason: String,
    detail: String,
    details: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["Në pritje", "Aprovuar", "Refuzuar"],
      default: "Në pritje",
    },
    note: String,
    assignedTo: { type: String, required: true, index: true },
    decidedAt: Date,
  },
  { versionKey: false, minimize: false, timestamps: true },
);

export default model("Request", requestSchema);
