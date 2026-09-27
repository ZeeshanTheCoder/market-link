import AppError from "./AppError.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;

const isString = (v) => typeof v === "string";
const clean = (v) => (isString(v) ? v.trim() : "");

// Throws 422 if the errors object has any key.
export const assertValid = (errors) => {
  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 422, errors);
  }
};

const checkPassword = (password, errors, field = "password") => {
  if (!isString(password) || password.length < 8) {
    errors[field] = "Password must be at least 8 characters";
  } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors[field] = "Password must include at least one letter and one number";
  }
};

export const validateRegister = (body) => {
  const errors = {};
  const name = clean(body.name);
  const role = body.role || "customer";

  if (name.length < 2) errors.name = "Name must be at least 2 characters";
  if (!EMAIL_RE.test(clean(body.email))) errors.email = "Enter a valid email address";
  checkPassword(body.password, errors);
  if (body.phone && !PHONE_RE.test(clean(body.phone))) errors.phone = "Enter a valid phone number";
  if (!["customer", "farmer"].includes(role)) errors.role = "Role must be customer or farmer";
  if (role === "farmer" && clean(body.stallName).length < 2) {
    errors.stallName = "Stall or business name is required";
  }
  return errors;
};

export const validateLogin = (body) => {
  const errors = {};
  if (!EMAIL_RE.test(clean(body.email))) errors.email = "Enter a valid email address";
  if (!isString(body.password) || body.password.length === 0) errors.password = "Password is required";
  return errors;
};

export const validateForgot = (body) => {
  const errors = {};
  if (!EMAIL_RE.test(clean(body.email))) errors.email = "Enter a valid email address";
  return errors;
};

export const validateReset = (body) => {
  const errors = {};
  if (!isString(body.token) || body.token.length < 10) errors.token = "Reset token is missing or invalid";
  checkPassword(body.password, errors);
  return errors;
};

export { clean };
