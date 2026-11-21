import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["student", "professor"] },
    password: { type: String, match: /^[0-9a-f]+:[0-9a-f]+$/ },
  },
  { versionKey: false, id: false },
);

export default model("User", userSchema);
