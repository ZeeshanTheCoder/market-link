export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Server error";
  let errors = err.fieldErrors || null; // from AppError (422 / 409)

  // Mongoose validation error -> 422
  if (err.name === "ValidationError" && err.errors) {
    status = 422;
    message = "Validation failed";
    errors = Object.fromEntries(
      Object.entries(err.errors).map(([field, e]) => [field, e.message])
    );
  }

  // Invalid ObjectId -> 400
  if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}`;
  }

  // Duplicate key (e.g. email) -> 409
  if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field} already exists`;
    errors = { [field]: `This ${field} is already in use` };
  }

  // Malformed JSON body -> 400
  if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Invalid JSON in request body";
  }

  if (status === 500) {
    console.error(err);
    if (process.env.NODE_ENV === "production") message = "Something went wrong";
  }

  res.status(status).json({
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV !== "production" && status === 500 && { stack: err.stack }),
  });
};
