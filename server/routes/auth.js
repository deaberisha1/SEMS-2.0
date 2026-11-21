import { Router } from "express";
import { User, Session } from "../models/index.js";
import { checkPassword, hashPassword, createSession, deleteSession, requireAuth } from "../middleware/auth.js";
import { loginLimiter, recordFailedLogin, clearFailedLogins } from "../middleware/rateLimit.js";
import { isText, validationError } from "../middleware/validate.js";

const router = Router();

router.post("/login", loginLimiter, async (req, res) => {
  const { id, password } = req.body || {};
  if (!isText(id, { min: 1, max: 50 }) || !isText(password, { min: 1, max: 200 })) {
    return res.status(400).json({ error: "Ju lutemi plotësoni ID-në dhe fjalëkalimin." });
  }
  const user = await User.findOne({ id: id.trim() });
  const ok = checkPassword(password, user?.password);
  if (!user || !ok) {
    recordFailedLogin(req);
    return res.status(401).json({ error: "ID ose fjalëkalimi është i gabuar." });
  }
  clearFailedLogins(req);
  const token = await createSession(user);
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post("/logout", requireAuth, async (req, res) => {
  await deleteSession(req.token);
  res.json({ ok: true });
});

router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!isText(currentPassword, { min: 1, max: 200 })) {
    return validationError(res, "currentPassword", "Shkruani fjalëkalimin aktual.");
  }
  if (!isText(newPassword, { min: 8, max: 200 }) || !/\d/.test(newPassword)) {
    return validationError(res, "newPassword", "Fjalëkalimi i ri duhet të ketë së paku 8 karaktere dhe 1 numër.");
  }
  const user = await User.findOne({ id: req.user.id });
  if (!user || !checkPassword(currentPassword, user.password)) {
    return validationError(res, "currentPassword", "Fjalëkalimi aktual është i gabuar.");
  }
  user.password = hashPassword(newPassword);
  await user.save();
  await Session.deleteMany({ userId: req.user.id, token: { $ne: req.token } });
  res.json({ ok: true });
});

export default router;
