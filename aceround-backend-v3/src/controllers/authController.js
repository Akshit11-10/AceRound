const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { signToken, sendTokenCookie, clearTokenCookie } = require("../utils/generateToken");

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

function runValidation(req) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new ApiError(400, "Validation failed", result.array().map((e) => e.msg));
  }
}

const registerValidators = [
  body("name").trim().notEmpty().withMessage("Full name is required.").isLength({ max: 80 }),
  body("email").trim().isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
];

const loginValidators = [
  body("email").trim().isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  runValidation(req);
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create({ name, email, password });

  const token = signToken(user._id);
  sendTokenCookie(res, token);

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
  });
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  runValidation(req);
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password +failedLoginAttempts +lockUntil");
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (user.lockUntil && user.lockUntil > Date.now()) {
    const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new ApiError(423, `Too many failed attempts. Try again in ${minutesLeft} minute(s).`);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
      user.failedLoginAttempts = 0;
    }
    await user.save({ validateBeforeSave: false });
    throw new ApiError(401, "Invalid email or password.");
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  await user.save({ validateBeforeSave: false });

  const token = signToken(user._id);
  sendTokenCookie(res, token);

  res.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
  });
});

// @route POST /api/auth/logout
const logout = asyncHandler(async (_req, res) => {
  clearTokenCookie(res);
  res.json({ success: true, message: "Logged out." });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, avatarUrl: req.user.avatarUrl },
  });
});

const updateProfileValidators = [
  body("name").trim().notEmpty().withMessage("Full name is required.").isLength({ max: 80 }),
  body("email").trim().isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
];

// @route PATCH /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  runValidation(req);
  const { name, email } = req.body;

  if (email !== req.user.email) {
    const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existing) throw new ApiError(409, "That email is already in use by another account.");
  }

  req.user.name = name;
  req.user.email = email;
  await req.user.save();

  res.json({
    success: true,
    user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, avatarUrl: req.user.avatarUrl },
  });
});

const changePasswordValidators = [
  body("currentPassword").notEmpty().withMessage("Current password is required."),
  body("newPassword").isLength({ min: 8 }).withMessage("New password must be at least 8 characters."),
];

// @route PATCH /api/auth/password
const changePassword = asyncHandler(async (req, res) => {
  runValidation(req);
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new ApiError(401, "Current password is incorrect.");

  user.password = newPassword; // pre-save hook re-hashes it
  await user.save();

  // Re-issue the auth cookie so the current session stays valid after the password change.
  const token = signToken(user._id);
  sendTokenCookie(res, token);

  res.json({ success: true, message: "Password updated." });
});

const deleteAccountValidators = [body("password").notEmpty().withMessage("Password is required to delete your account.")];

// @route DELETE /api/auth/account
// Deletes the user's account and all of their interview history.
const deleteAccount = asyncHandler(async (req, res) => {
  runValidation(req);
  const { password } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new ApiError(401, "Incorrect password. Account was not deleted.");

  const Interview = require("../models/Interview");
  await Interview.deleteMany({ user: user._id });
  await user.deleteOne();

  clearTokenCookie(res);
  res.json({ success: true, message: "Account deleted." });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
  registerValidators,
  loginValidators,
  updateProfileValidators,
  changePasswordValidators,
  deleteAccountValidators,
};
