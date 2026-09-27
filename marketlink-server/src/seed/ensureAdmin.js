import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * Ensures the local/demo administrator exists in MongoDB after the DB connects.
 * This is intentionally enabled for development/demo use so the Admin Console
 * works without requiring a separate seed command.
 */
export async function ensureAdmin() {
  if (process.env.NODE_ENV === "production" && String(process.env.ADMIN_AUTO_SEED || "false").toLowerCase() !== "true") {
    return null;
  }

  const email = String(process.env.ADMIN_EMAIL || "admin@gmail.com").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "admin123");
  const name = String(process.env.ADMIN_NAME || "MarketLink Admin").trim();

  if (!email || password.length < 8) {
    throw new Error("Valid ADMIN_EMAIL and ADMIN_PASSWORD (8+ chars) are required for admin bootstrap.");
  }

  let user = await User.findOne({ email }).select("+password");
  if (!user) {
    user = await User.create({
      name,
      email,
      password,
      role: "admin",
      status: "active",
    });
    console.log(`Admin ready: created ${email}`);
    return user;
  }

  let changed = false;
  if (user.name !== name) {
    user.name = name;
    changed = true;
  }
  if (user.role !== "admin") {
    user.role = "admin";
    changed = true;
  }
  if (user.status !== "active") {
    user.status = "active";
    changed = true;
  }

  // Keep the demo credentials deterministic for local development.
  const passwordMatches = user.password ? await bcrypt.compare(password, user.password) : false;
  if (!passwordMatches) {
    user.password = password;
    changed = true;
  }

  if (changed) await user.save();
  console.log(`Admin ready: ${email}`);
  return user;
}
