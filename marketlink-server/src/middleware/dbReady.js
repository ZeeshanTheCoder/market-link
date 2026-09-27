import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

export function requireDb(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return next(new AppError("Database is not connected. Add a valid MONGO_URI and ensure MongoDB Atlas is reachable.", 503));
  }
  next();
}
