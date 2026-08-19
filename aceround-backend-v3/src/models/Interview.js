const mongoose = require("mongoose");

// One question as stored server-side (includes the correct answer + explanation).
const questionSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true }, // stable id within this interview
    question: { type: String, required: true },
    options: {
      type: [String],
      required: true,
      validate: (arr) => Array.isArray(arr) && arr.length >= 2,
    },
    correctAnswer: { type: Number, required: true }, // index into options
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    selectedOption: { type: Number, default: null },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: { type: String, required: true, trim: true },

    status: {
      type: String,
      enum: ["in-progress", "completed", "expired"],
      default: "in-progress",
    },

    // Full question bank for this session (correct answers included).
    // Never sent to the client until the interview is submitted.
    questions: { type: [questionSchema], required: true },

    answers: { type: [answerSchema], default: [] },

    totalQuestions: { type: Number, required: true },
    correctCount: { type: Number, default: 0 },
    score: { type: Number, default: 0 }, // percentage 0-100

    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
    targetCompany: { type: String, default: null, trim: true },

    timeLimitSeconds: { type: Number, default: 900 },
    timeSpentSeconds: { type: Number, default: 0 },

    source: { type: String, enum: ["ai", "static"], default: "static" },
    aiProvider: { type: String, default: null },

    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

interviewSchema.index({ user: 1, createdAt: -1 });

// Never leak correct answers / explanations while an interview is still in progress.
interviewSchema.methods.toPublicQuestions = function toPublicQuestions() {
  return this.questions.map((q) => ({
    id: q.questionId,
    question: q.question,
    options: q.options,
  }));
};

// Full detail (with correct answers + explanations) used for the results/review screen.
interviewSchema.methods.toDetailedResult = function toDetailedResult() {
  const answerMap = new Map(this.answers.map((a) => [a.questionId, a.selectedOption]));
  return {
    id: this._id,
    role: this.role,
    status: this.status,
    score: this.score,
    correctCount: this.correctCount,
    totalQuestions: this.totalQuestions,
    timeSpent: this.timeSpentSeconds,
    date: this.completedAt || this.createdAt,
    source: this.source,
    difficulty: this.difficulty,
    targetCompany: this.targetCompany,
    questions: this.questions.map((q) => ({
      id: q.questionId,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    })),
    userAnswers: Object.fromEntries(answerMap),
  };
};

module.exports = mongoose.model("Interview", interviewSchema);
