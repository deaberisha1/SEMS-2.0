import mongoose from "mongoose";

export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error("MONGODB_URI is missing. Copy server/.env.example to server/.env and add the Atlas connection string.");
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connected (database: ${mongoose.connection.name})`);
}

export function dbStatus() {
  return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
}
