const mongoose = require("mongoose");

// A "Mock Drive" is the full 3-round pipeline: MCQ -> Coding -> AI Interview.
// It is intentionally separate from the existing Interview model — the
// existing single-round interview feature is untouched; this is a new,
// additive flow that a user can start from the dashboard.
const mockDriveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // What drives the question generation for this drive.
    source: {
      type: String,
      enum: ["resume", "role"],
      required: true,
    },

    // Present when source === "role".
    role: { type: String, default: null, trim: true },

    // Present when source === "resume". We store the already-extracted
    // plain text (reusing the existing /api/resume/extract endpoint) rather
    // than the raw file, since nothing else in the app persists resume files.
    resumeText: { type: String, default: null },

    // Aptitude round: same shape/pattern as mcqQuestions — generic
    // Quant+Reasoning+Verbal mix, generated before MCQ, no role/resume needed.
    aptitudeQuestions: {
      type: [
        {
          questionId: { type: String, required: true },
          question: { type: String, required: true },
          options: { type: [String], required: true },
          correctAnswer: { type: Number, required: true },
          explanation: { type: String, default: "" },
        },
      ],
      default: [],
    },

    // MCQ round: generated questions (correct answers included) stored here
    // temporarily until the user submits. Never sent to the client with
    // correctAnswer/explanation before submission.
    mcqQuestions: {
      type: [
        {
          questionId: { type: String, required: true },
          question: { type: String, required: true },
          options: { type: [String], required: true },
          correctAnswer: { type: Number, required: true },
          explanation: { type: String, default: "" },
        },
      ],
      default: [],
    },


    // Which stage the user is currently on / unlocked up to.
    currentStage: {
      type: String,
      enum: ["aptitude", "mcq", "coding", "interview", "completed"],
      default: "aptitude",
    },

    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
    },

    // Filled in as each round is completed.
    aptitudeResult: {
      score: { type: Number, default: null },
      passed: { type: Boolean, default: null },
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
    // Per-problem submit status for the coding round, e.g.
    // { "dsa-1": { solved: true, submittedAt: ... }, ... }
    // Which 4 problems (from the larger pool) were randomly picked for this
    // drive's coding round — persisted so refreshing the page doesn't
    // reshuffle them mid-attempt.
    codingProblemIds: { type: [String], default: [] },
    codingProgress: { type: mongoose.Schema.Types.Mixed, default: {} },
    interviewResult: {
      score: { type: Number, default: null },
      feedback: { type: String, default: null },
    },
    // The live back-and-forth conversation for the AI Interview round.
    interviewTranscript: {
      type: [
        {
          role: { type: String, enum: ["ai", "user"], required: true },
          text: { type: String, required: true },
          at: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

mockDriveSchema.index({ user: 1, createdAt: -1 });

// Safe shape to send to the frontend (no need to hide anything here yet,
// but centralizing this now makes it easy to control what's exposed later).
mockDriveSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    source: this.source,
    role: this.role,
    hasResume: !!this.resumeText,
    currentStage: this.currentStage,
    status: this.status,
    aptitudeResult: this.aptitudeResult,
    mcqResult: this.mcqResult,
    codingResult: this.codingResult,
    codingProgress: this.codingProgress,
    interviewResult: this.interviewResult,
    interviewTranscript: this.interviewTranscript,
    startedAt: this.startedAt,
    completedAt: this.completedAt,
  };
};

// Never leak correct answers / explanations while the Aptitude round is in progress.
mockDriveSchema.methods.toPublicAptitudeQuestions = function toPublicAptitudeQuestions() {
  return this.aptitudeQuestions.map((q) => ({
    id: q.questionId,
    question: q.question,
    options: q.options,
  }));
};

// Never leak correct answers / explanations while the MCQ round is in progress.
mockDriveSchema.methods.toPublicMcqQuestions = function toPublicMcqQuestions() {
  return this.mcqQuestions.map((q) => ({
    id: q.questionId,
    question: q.question,
    options: q.options,
  }));
};

module.exports = mongoose.model("MockDrive", mockDriveSchema);
