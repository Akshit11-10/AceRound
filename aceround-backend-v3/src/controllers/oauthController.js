const crypto = require("crypto");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { signToken, sendTokenCookie } = require("../utils/generateToken");

const OAUTH_STATE_COOKIE = "oauth_state";

function frontendUrl(path = "/") {
  return `${(process.env.FRONTEND_URL || "http://localhost:3400").replace(/\/$/, "")}${path}`;
}

function setStateCookie(res, state) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 5 * 60 * 1000, // 5 minutes — just long enough for the redirect round-trip
    path: "/",
  });
}

// Finds a user by OAuth provider id, or by matching email (linking to an
// existing local/other-provider account), or creates a brand new user.
async function findOrCreateOAuthUser({ provider, providerId, email, name, avatarUrl }) {
  const idField = provider === "google" ? "googleId" : "githubId";

  let user = await User.findOne({ [idField]: providerId });
  if (user) return user;

  if (email) {
    user = await User.findOne({ email });
    if (user) {
      user[idField] = providerId;
      if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
      await user.save();
      return user;
    }
  }

  user = await User.create({
    name: name || "New User",
    email: email || `${provider}-${providerId}@no-email.aceround.local`,
    authProvider: provider,
    [idField]: providerId,
    avatarUrl: avatarUrl || null,
  });
  return user;
}

function finishOAuthLogin(res, user) {
  const token = signToken(user._id);
  sendTokenCookie(res, token);
  res.redirect(frontendUrl("/dashboard"));
}

// ---------------------------------------------------------------------------
// Google
// ---------------------------------------------------------------------------

// @route GET /api/auth/google
const googleRedirect = asyncHandler(async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.redirect(frontendUrl("/login?error=google_not_configured"));

  const state = crypto.randomBytes(16).toString("hex");
  setStateCookie(res, state);

  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || "http:///api/auth/google/callback";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

// @route GET /api/auth/google/callback
const googleCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  const savedState = req.cookies?.[OAUTH_STATE_COOKIE];

  if (!code || !state || state !== savedState) {
    return res.redirect(frontendUrl("/login?error=oauth_state_mismatch"));
  }

  try {
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL || "https://aceround-backend.onrender.com/api/auth/google/callback";
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: callbackUrl,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) throw new Error(`Google token exchange failed: ${tokenRes.status}`);
    const tokenData = await tokenRes.json();

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!profileRes.ok) throw new Error(`Google profile fetch failed: ${profileRes.status}`);
    const profile = await profileRes.json();

    const user = await findOrCreateOAuthUser({
      provider: "google",
      providerId: profile.sub,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.picture,
    });

    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/" });
    finishOAuthLogin(res, user);
  } catch (err) {
    console.error("[oauth] Google login failed:", err.message);
    res.redirect(frontendUrl("/login?error=google_login_failed"));
  }
});

// ---------------------------------------------------------------------------
// GitHub
// ---------------------------------------------------------------------------

// @route GET /api/auth/github
const githubRedirect = asyncHandler(async (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return res.redirect(frontendUrl("/login?error=github_not_configured"));

  const state = crypto.randomBytes(16).toString("hex");
  setStateCookie(res, state);

  const callbackUrl = process.env.GITHUB_CALLBACK_URL || "https://aceround-backend.onrender.com/api/auth/github/callback";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: "read:user user:email",
    state,
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

// @route GET /api/auth/github/callback
const githubCallback = asyncHandler(async (req, res) => {
  const { code, state } = req.query;
  const savedState = req.cookies?.[OAUTH_STATE_COOKIE];

  if (!code || !state || state !== savedState) {
    return res.redirect(frontendUrl("/login?error=oauth_state_mismatch"));
  }

  try {
    const callbackUrl = process.env.GITHUB_CALLBACK_URL || "https://aceround-backend.onrender.com/api/auth/github/callback";
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        redirect_uri: callbackUrl,
      }),
    });
    if (!tokenRes.ok) throw new Error(`GitHub token exchange failed: ${tokenRes.status}`);
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("GitHub did not return an access token");

    const profileRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, "User-Agent": "AceRound-App" },
    });
    if (!profileRes.ok) throw new Error(`GitHub profile fetch failed: ${profileRes.status}`);
    const profile = await profileRes.json();

    // GitHub only includes email in /user if the user made it public.
    // Fall back to the emails endpoint to find their primary verified address.
    let email = profile.email;
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${tokenData.access_token}`, "User-Agent": "AceRound-App" },
      });
      if (emailsRes.ok) {
        const emails = await emailsRes.json();
        const primary = emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified);
        email = primary?.email || null;
      }
    }

    const user = await findOrCreateOAuthUser({
      provider: "github",
      providerId: String(profile.id),
      email,
      name: profile.name || profile.login,
      avatarUrl: profile.avatar_url,
    });

    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/" });
    finishOAuthLogin(res, user);
  } catch (err) {
    console.error("[oauth] GitHub login failed:", err.message);
    res.redirect(frontendUrl("/login?error=github_login_failed"));
  }
});

module.exports = { googleRedirect, googleCallback, githubRedirect, githubCallback };
