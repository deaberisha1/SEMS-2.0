import "./env.js";
import express from "express";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { connectDB, dbStatus } from "./db.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import professorRoutes from "./routes/professor.js";

const app = express();
const PORT = process.env.PORT || 4000;
const isProd = process.env.NODE_ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("trust proxy", process.env.TRUST_PROXY ? Number(process.env.TRUST_PROXY) : isProd ? 1 : false);
app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "img-src": ["'self'", "data:", "blob:", "https://images.unsplash.com"],
        "upgrade-insecure-requests": isProd ? [] : null,
      },
    },
  }),
);
app.use(express.json({ limit: "20kb" }));

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, db: dbStatus() });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/professor", professorRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
});

const clientDist = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(clientDist)) {
  app.use("/assets", express.static(path.join(clientDist, "assets"), { maxAge: "1y", immutable: true }));
  app.use(express.static(clientDist, { index: false }));
  app.use((req, res) => {
    res.set("Cache-Control", "no-cache");
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Të dhënat e dërguara nuk janë JSON valid." });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Të dhënat e dërguara janë shumë të mëdha." });
  }
  if (err.name === "ValidationError") {
    const field = Object.keys(err.errors || {})[0];
    return res.status(400).json({ error: "Të dhëna të pavlefshme.", field });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Të dhëna të pavlefshme.", field: err.path });
  }
  if (err.code === 11000) {
    return res.status(409).json({ error: "Ky regjistrim ekziston tashmë." });
  }
  console.error(err);
  res.status(500).json({ error: "Gabim i brendshëm në server." });
});

try {
  await connectDB();
} catch (err) {
  console.error("MongoDB connection failed: " + err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`SEMS server running on http://localhost:${PORT}`);
});
