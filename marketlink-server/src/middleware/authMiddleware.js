import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getJwtSecret } from "../utils/jwtConfig.js";

// Verifies the JWT and attaches the user to req.user.
export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Authentication required. Please log in.", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(header.split(" ")[1], getJwtSecret());
  } catch {
    throw new AppError("Your session is invalid or has expired. Please log in again.", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("This account no longer exists.", 401);
  if (user.status !== "active") {
    throw new AppError("Your account has been deactivated. Please contact support.", 403);
  }

  req.user = user;
  next();
});

// Role-based access: authorize("admin"), authorize("farmer", "admin"), ...
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action.", 403));
    }
    next();
  };
