import { Schema, model } from "mongoose";

export const CERTIFICATE_TYPES = [
  "Vërtetim i statusit studentor",
  "Vërtetim për notat e kaluara",
  "Vërtetim për bursë",
  "Vërtetim për vizë",
  "Vërtetim për konvikt",
];

export const CERTIFICATE_LANGUAGES = ["Shqip", "Anglisht", "Dygjuhësh (SQ/EN)"];

const certificateSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, index: true },
    lloji: { type: String, required: true, enum: CERTIFICATE_TYPES },
    gjuha: { type: String, required: true, enum: CERTIFICATE_LANGUAGES },
    arsyeja: { type: String, default: "", maxlength: 300 },
    statusi: { type: String, default: "E vlefshme" },
  },
  { versionKey: false, timestamps: true },
);

export default model("Certificate", certificateSchema);
