const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;

export const isEmail = (v) => EMAIL_RE.test((v || "").trim());

const checkPassword = (password, errors) => {
  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = "Password must include at least one letter and one number";
  }
};

export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!isEmail(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";
  return errors;
};

export const validateRegister = (f) => {
  const errors = {};
  if ((f.name || "").trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!isEmail(f.email)) errors.email = "Enter a valid email address";
  if (f.phone && !PHONE_RE.test(f.phone.trim())) errors.phone = "Enter a valid phone number";
  checkPassword(f.password, errors);
  if (f.password !== f.confirmPassword) errors.confirmPassword = "Passwords do not match";
  if (f.role === "farmer" && (f.stallName || "").trim().length < 2) {
    errors.stallName = "Stall or business name is required";
  }
  return errors;
};

export const validateForgot = ({ email }) =>
  isEmail(email) ? {} : { email: "Enter a valid email address" };

export const validateReset = ({ password, confirmPassword }) => {
  const errors = {};
  checkPassword(password, errors);
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
  return errors;
};
