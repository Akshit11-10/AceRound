const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    password: {
      type: String,
      required: [
        function passwordRequired() {
          return this.authProvider === "local";
        },
        "Password is required",
      ],
      minlength: 8,
      select: false, // never returned by default in queries
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    googleId: { type: String, default: null, index: true, sparse: true },
    githubId: { type: String, default: null, index: true, sparse: true },
    avatarUrl: { type: String, default: null },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Simple brute-force protection
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

// Hash password before saving, only if it was modified
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare plaintext password with the hash
userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  if (!this.password) return false; // OAuth-only accounts have no password
  return bcrypt.compare(enteredPassword, this.password);
};

// Virtual to know if account is currently locked
userSchema.virtual("isLocked").get(function isLocked() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.failedLoginAttempts;
    delete ret.lockUntil;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
