import "../config/env.js";
import mongoose from "mongoose";
import User from "../models/User.js";

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_NAME = String(process.env.ADMIN_NAME || "MarketLink Admin").trim();
const ADMIN_EMAIL = String(process.env.ADMIN_EMAIL || "admin@gmail.com")
  .trim()
  .toLowerCase();
const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || "admin123");

if (!ADMIN_EMAIL || !ADMIN_PASSWORD)
  throw new Error("Admin email/password are required");
if (ADMIN_PASSWORD.length < 8)
  throw new Error("ADMIN_PASSWORD must be at least 8 characters");

try {
  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4,
  });

  const user = await User.findOne({ email: ADMIN_EMAIL }).select("+password");
  if (user) {
    user.name = ADMIN_NAME;
    user.role = "admin";
    user.status = "active";
    user.password = ADMIN_PASSWORD;
    await user.save();
    console.log(`Updated admin ${ADMIN_EMAIL}`);
  } else {
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      status: "active",
    });
    console.log(`Created admin ${ADMIN_EMAIL}`);
  }
} catch (err) {
  console.error(`Admin seed failed: ${err?.message || err}`);
  process.exitCode = 1;
} finally {
  try {
    await mongoose.disconnect();
  } catch {}
}
