const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

const attempts = new Map();

function keyFor(req) {
  const id = String(req.body?.id ?? "").trim().toLowerCase();
  return `${req.ip}|${id}`;
}

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.lockedUntil ? now > entry.lockedUntil : now - entry.firstAttempt > WINDOW_MS) {
      attempts.delete(key);
    }
  }
}

setInterval(cleanup, 5 * 60 * 1000).unref();

export function loginLimiter(req, res, next) {
  const key = keyFor(req);
  const now = Date.now();
  const entry = attempts.get(key);

  if (entry?.lockedUntil) {
    if (now < entry.lockedUntil) {
      const minutesLeft = Math.ceil((entry.lockedUntil - now) / 60000);
      return res.status(429).json({
        error: `Shumë tentativa të dështuara. Provoni përsëri pas ${minutesLeft} minutash.`,
      });
    }
    attempts.delete(key);
  }

  next();
}

export function recordFailedLogin(req) {
  const key = keyFor(req);
  const now = Date.now();
  const entry = attempts.get(key) || { count: 0, firstAttempt: now };

  if (now - entry.firstAttempt > WINDOW_MS) {
    entry.count = 1;
    entry.firstAttempt = now;
  } else {
    entry.count++;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }

  attempts.set(key, entry);
}

export function clearFailedLogins(req) {
  attempts.delete(keyFor(req));
}
