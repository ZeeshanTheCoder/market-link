import AppError from "../utils/AppError.js";
import connectDB from "../config/db.js";

export async function requireDb(req, res, next) {
  try {
    await connectDB();

    next();
  } catch (error) {
    console.error("Database connection error:", error);

    next(
      new AppError(
        "Database connection failed. Please check MongoDB Atlas and MONGO_URI.",
        503
      )
    );
  }
}
