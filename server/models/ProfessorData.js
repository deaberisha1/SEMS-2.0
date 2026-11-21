import { Schema, model } from "mongoose";

const professorDataSchema = new Schema(
  {
    userId: { type: String, unique: true },
    profile: { type: Schema.Types.Mixed, default: {} },
    courses: { type: [Schema.Types.Mixed], default: [] },
    studentsByCourse: { type: Schema.Types.Mixed, default: {} },
    schedule: { type: Schema.Types.Mixed, default: {} },
  },
  { versionKey: false },
);

export default model("ProfessorData", professorDataSchema);
