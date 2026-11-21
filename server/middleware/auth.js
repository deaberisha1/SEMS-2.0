import crypto from "node:crypto";
import { Session } from "../models/index.js";

const SESSION_DAYS = Number(process.env.SESSION_DAYS) || 7;
const DUMMY_HASH = hashPassword("dummy-password-for-timing");

export async function createSession(user) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
  await Session.create({
    token,
    userId: user.id,
    name: user.name,
    role: user.role,
    expiresAt,
  });
  return token;
}

export async function deleteSession(token) {
  await Session.deleteOne({ token });
}

function tokenFrom(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

export async function requireAuth(req, res, next) {
  const token = tokenFrom(req);
  if (!token) return res.status(401).json({ error: "Duhet të hyni në sistem." });
  const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } });
  if (!session) return res.status(401).json({ error: "Seanca ka skaduar. Hyni përsëri." });
  req.user = { id: session.userId, name: session.name, role: session.role };
  req.token = token;
  next();
}

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role)
      return res.status(403).json({ error: "Nuk keni qasje në këtë faqe." });
    next();
  };
}

export function checkPassword(password, stored) {
  const [salt, hash] = String(stored || DUMMY_HASH).split(":");
  const expected = Buffer.from(hash || "", "hex");
  const test = crypto.scryptSync(String(password), salt || "", 64);
  return expected.length === test.length && crypto.timingSafeEqual(test, expected);
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
