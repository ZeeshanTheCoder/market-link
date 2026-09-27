// Operational error with an HTTP status and optional per-field messages (used for 422).
export default class AppError extends Error {
  constructor(message, statusCode = 500, fieldErrors = null) {
    super(message);
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    this.isOperational = true;
  }
}
