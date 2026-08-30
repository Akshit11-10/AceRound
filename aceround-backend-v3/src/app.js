const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const mockDriveRoutes = require("./routes/mockDriveRoutes");
const atsRoutes = require("./routes/atsRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// Render (and most PaaS) sit behind a reverse proxy that terminates HTTPS.
// Without this, Express doesn't know the original request was secure,
// which can interfere with secure/sameSite=None cookies behind the proxy.
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// CORS — must allow credentials so the httpOnly auth cookie is sent/received
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ / . operators from user input to prevent NoSQL injection

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "AceRound API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mock-drive", mockDriveRoutes);
app.use("/api/ats", atsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
