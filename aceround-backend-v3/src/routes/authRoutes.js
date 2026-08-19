const express = require("express");
const {
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
} = require("../controllers/authController");
const { googleRedirect, googleCallback, githubRedirect, githubCallback } = require("../controllers/oauthController");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", authLimiter, registerValidators, register);
router.post("/login", authLimiter, loginValidators, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfileValidators, updateProfile);
router.patch("/password", protect, authLimiter, changePasswordValidators, changePassword);
router.delete("/account", protect, authLimiter, deleteAccountValidators, deleteAccount);

// OAuth (Google / GitHub) — full-page browser redirects, not JSON APIs.
router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);
router.get("/github", githubRedirect);
router.get("/github/callback", githubCallback);

module.exports = router;
