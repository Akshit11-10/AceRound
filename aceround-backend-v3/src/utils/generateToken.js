const jwt = require("jsonwebtoken");

/**
 * Signs a JWT for a given user id.
 */
function signToken(userId) {
  return jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

/**
 * Sets the auth token as an httpOnly cookie on the response.
 * httpOnly + sameSite cookies are used instead of localStorage so the
 * token is never reachable from client-side JS (XSS-resistant).
 */
function sendTokenCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  const maxAgeMs = 2 * 60 * 60 * 1000; // 2 hours — short-lived so it survives a
  // mobile "desktop site" mode switch (which can clear pure session cookies)
  // while still auto-expiring reasonably soon on inactivity.

  res.cookie(process.env.COOKIE_NAME || "aceround_token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: maxAgeMs,
    path: "/",
  });
}

function clearTokenCookie(res) {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie(process.env.COOKIE_NAME || "aceround_token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}

module.exports = { signToken, sendTokenCookie, clearTokenCookie };