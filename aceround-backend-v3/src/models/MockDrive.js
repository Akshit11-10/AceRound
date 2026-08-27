// aceround-backend-v3/src/models/MockDrive.js
const mongoose = require("mongoose");

const mockDriveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    source: {
      type: String,
      enum: ["resume", "role"],
      required: true,
    },
    role: { type: String, default: null, trim: true },
    resumeText: { type: String, default: null },
    currentStage: {
      type: String,
      enum: ["mcq", "coding", "interview", "completed"],
      default: "mcq",
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },
    mcqResult: {
      score: { type: Number, default: null },
      passed: { type: Boolean, default: null },
      weakTopics: { type: [String], default: [] },
    },
    codingResult: {
      solvedCount: { type: Number, default: null },
      totalCount: { type: Number, default: null },
      passed: { type: Boolean, default: null },
    },
    interviewResult: {
      score: { type: Number, default: null },
      feedback: { type: String, default: null },
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

mockDriveSchema.index({ user: 1, createdAt: -1 });

mockDriveSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    source: this.source,
    role: this.role,
    hasResume: !!this.resumeText,
    currentStage: this.currentStage,
    status: this.status,
    mcqResult: this.mcqResult,
    codingResult: this.codingResult,
    interviewResult: this.interviewResult,
    startedAt: this.startedAt,
    completedAt: this.completedAt,
  };
};

module.exports = mongoose.model("MockDrive", mockDriveSchema);