import { Schema, model } from "mongoose";

const sessionSchema = new Schema(
  {
    token: { type: String, unique: true },
    userId: { type: String, index: true },
    name: String,
    role: String,
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false, timestamps: { createdAt: true, updatedAt: false } },
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model("Session", sessionSchema);
