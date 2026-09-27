import crypto from "crypto";
import User from "../models/User.js";
import FarmerProfile from "../models/FarmerProfile.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/mailer.js";
import {
  assertValid,
  clean,
  validateRegister,
  validateLogin,
  validateForgot,
  validateReset,
} from "../utils/validators.js";

const getFarmerProfile = (user) =>
  user.role === "farmer" ? FarmerProfile.findOne({ userId: user._id }) : null;

const sendSession = async (res, status, user) => {
  const farmerProfile = await getFarmerProfile(user);
  res.status(status).json({ token: generateToken(user._id), user, farmerProfile });
};

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  assertValid(validateRegister(req.body));

  const email = clean(req.body.email).toLowerCase();
  const role = req.body.role || "customer";
  const name = clean(req.body.name);

  if (await User.findOne({ email })) {
    throw new AppError("An account with this email already exists", 409, {
      email: "This email is already registered",
    });
  }

  const user = await User.create({
    name,
    email,
    password: req.body.password,
    phone: clean(req.body.phone),
    address: clean(req.body.address),
    role,
  });

  if (role === "farmer") {
    try {
      await FarmerProfile.create({
        userId: user._id,
        stallName: clean(req.body.stallName),
        contactPerson: clean(req.body.contactPerson) || name,
        address: clean(req.body.address),
      });
    } catch (err) {
      await User.findByIdAndDelete(user._id); // do not leave a farmer without a profile
      throw err;
    }
  }

  await sendSession(res, 201, user);
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  assertValid(validateLogin(req.body));

  const user = await User.findOne({ email: clean(req.body.email).toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(req.body.password))) {
    throw new AppError("Invalid email or password", 401);
  }
  if (user.status !== "active") {
    throw new AppError("Your account has been deactivated. Please contact support.", 403);
  }

  await sendSession(res, 200, user);
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const farmerProfile = await getFarmerProfile(req.user);
  res.json({ user: req.user, farmerProfile });
});

// POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  assertValid(validateForgot(req.body));

  const genericMessage = "If an account exists for this email, a reset link has been sent.";
  const user = await User.findOne({ email: clean(req.body.email).toLowerCase() });

  let devResetUrl;
  if (user && user.status === "active") {
    const rawToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    const emailed = await sendEmail({
      to: user.email,
      subject: "MarketLink password reset",
      text: `Use this link to reset your MarketLink password: ${resetUrl}`,
      html: `<p>Use this link to reset your MarketLink password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 30 minutes.</p>`,
    }).catch((err) => { console.error("Password reset email failed:", err.message); return false; });
    if (!emailed && process.env.NODE_ENV !== "production") {
      console.log(`Password reset link for ${user.email}: ${resetUrl}`);
      devResetUrl = resetUrl;
    }
  }

  res.json({ message: genericMessage, ...(devResetUrl && { devResetUrl }) });
});

// POST /api/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
  assertValid(validateReset(req.body));

  const hashed = crypto.createHash("sha256").update(req.body.token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+resetPasswordToken +resetPasswordExpire");

  if (!user) throw new AppError("This reset link is invalid or has expired.", 400);

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: "Password updated. You can now log in." });
});
