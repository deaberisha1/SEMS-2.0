export function isEmail(value) {
  return typeof value === "string" && value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isPhone(value) {
  return typeof value === "string" && /^\+?[0-9 ]{8,16}$/.test(value);
}

export function isIban(value) {
  return typeof value === "string" && /^XK\d{18}$/.test(value);
}

export function isText(value, { min = 0, max = 2000 } = {}) {
  return typeof value === "string" && value.trim().length >= min && value.length <= max;
}

export function isOptionalText(value, max = 2000) {
  return value === undefined || value === null || value === "" || isText(value, { max });
}

export function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function inRange(value, min, max) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

export function validationError(res, field, message) {
  return res.status(400).json({ error: message, field });
}
