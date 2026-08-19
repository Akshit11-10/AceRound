const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

/**
 * Protects a route: requires a valid JWT.
 * The token is read from the httpOnly cookie first (primary, used by the
 * web frontend), falling back to an `Authorization: Bearer <token>` header
 * (useful for non-browser clients / API testing).
 */
const protect = asyncHandler(async (req, _res, next) => {
  const cookieName = process.env.COOKIE_NAME || "aceround_token";
  let token = req.cookies?.[cookieName];

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authenticated. Please log in.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Session expired or invalid. Please log in again.");
  }

  const user = await User.findById(decoded.sub);
  if (!user) {
    throw new ApiError(401, "User for this session no longer exists.");
  }

  req.user = user;
  next();
});

// Requires the logged-in user to have role === 'admin'. Use after `protect`.
const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== "admin") {
    throw new ApiError(403, "Admin access required.");
  }
  next();
};

module.exports = { protect, requireAdmin };
