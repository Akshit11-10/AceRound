const crypto = require("crypto");
const { body, validationResult } = require("express-validator");
const Interview = require("../models/Interview");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { generateQuestions } = require("../services/aiQuestionService");

function runValidation(req) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw new ApiError(400, "Validation failed", result.array().map((e) => e.msg));
  }
}

const startValidators = [
  body("role").trim().notEmpty().withMessage("Role is required.").isLength({ max: 100 }),
  body("count").optional().isInt({ min: 5, max: 40 }).withMessage("count must be between 5 and 40."),
  body("difficulty").optional().isIn(["easy", "medium", "hard"]).withMessage("difficulty must be easy, medium, or hard."),
  body("targetCompany").optional().trim().isLength({ max: 60 }).withMessage("targetCompany is too long."),
  body("resumeText").optional().trim().isLength({ max: 6000 }).withMessage("resumeText is too long."),
];

// @route POST /api/interviews/start
// Generates (AI or fallback) a fresh question set for `role`, stores the
// full set (with correct answers) server-side, and returns only the
// question text + options to the client — answers stay server-side until submit.
const startInterview = asyncHandler(async (req, res) => {
  runValidation(req);
  const { role, targetCompany, resumeText } = req.body;
  const count = req.body.count ? Number(req.body.count) : Number(process.env.DEFAULT_QUESTION_COUNT) || 20;
  const difficulty = req.body.difficulty || "medium";

  // Time budget: 0.75 minutes per question (e.g. 20 questions -> 15 minutes).
  const timeLimitSeconds = Math.round(count * 0.75 * 60);

  const { questions, source, provider } = await generateQuestions(role, count, {
    difficulty,
    targetCompany,
    resumeText,
  });

  const questionDocs = questions.map((q) => ({
    questionId: crypto.randomUUID(),
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));

  const interview = await Interview.create({
    user: req.user._id,
    role,
    status: "in-progress",
    questions: questionDocs,
    totalQuestions: questionDocs.length,
    timeLimitSeconds,
    difficulty,
    targetCompany: targetCompany || null,
    source,
    aiProvider: provider,
  });

  res.status(201).json({
    success: true,
    interviewId: interview._id,
    role: interview.role,
    timeLimitSeconds: interview.timeLimitSeconds,
    source: interview.source,
    questions: interview.toPublicQuestions(),
  });
});

const submitValidators = [
  body("answers").isObject().withMessage("answers must be an object of { questionId: selectedOptionIndex }."),
  body("timeSpent").optional().isInt({ min: 0 }).withMessage("timeSpent must be a non-negative integer."),
];

// @route POST /api/interviews/:id/submit
// Scores the interview server-side (client never had the correct answers)
// and returns the full detailed result for the Results screen.
const submitInterview = asyncHandler(async (req, res) => {
  runValidation(req);
  const { id } = req.params;
  const { answers, timeSpent } = req.body;

  const interview = await Interview.findOne({ _id: id, user: req.user._id });
  if (!interview) throw new ApiError(404, "Interview not found.");
  if (interview.status === "completed") {
    throw new ApiError(409, "This interview has already been submitted.");
  }

  const validIds = new Set(interview.questions.map((q) => q.questionId));
  const answerEntries = Object.entries(answers || {}).filter(([qid]) => validIds.has(qid));

  interview.answers = answerEntries.map(([questionId, selectedOption]) => ({
    questionId,
    selectedOption: Number.isInteger(selectedOption) ? selectedOption : Number(selectedOption),
  }));

  let correctCount = 0;
  const answerMap = new Map(interview.answers.map((a) => [a.questionId, a.selectedOption]));
  for (const q of interview.questions) {
    if (answerMap.get(q.questionId) === q.correctAnswer) correctCount++;
  }

  interview.correctCount = correctCount;
  interview.score = interview.totalQuestions > 0 ? Math.round((correctCount / interview.totalQuestions) * 100) : 0;
  interview.timeSpentSeconds = Number.isFinite(timeSpent) ? timeSpent : interview.timeLimitSeconds;
  interview.status = "completed";
  interview.completedAt = new Date();

  await interview.save();

  res.json({ success: true, result: interview.toDetailedResult() });
});

// @route GET /api/interviews
// Summary list for the Dashboard (stats, recent interviews) — no question detail.
const listInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ user: req.user._id, status: "completed" })
    .sort({ completedAt: -1, createdAt: -1 })
    .select("role score correctCount totalQuestions timeSpentSeconds completedAt createdAt source");

  const results = interviews.map((iv) => ({
    id: iv._id,
    role: iv.role,
    score: iv.score,
    correctCount: iv.correctCount,
    totalQuestions: iv.totalQuestions,
    timeSpent: iv.timeSpentSeconds,
    date: (iv.completedAt || iv.createdAt).toLocaleDateString("en-US"),
    source: iv.source,
  }));

  res.json({ success: true, results });
});

// @route GET /api/interviews/:id
// Full detail (questions + correct answers + explanations) for the review screen.
const getInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
  if (!interview) throw new ApiError(404, "Interview not found.");
  if (interview.status !== "completed") {
    throw new ApiError(400, "Interview is not completed yet.");
  }
  res.json({ success: true, result: interview.toDetailedResult() });
});

module.exports = {
  startInterview,
  submitInterview,
  listInterviews,
  getInterview,
  startValidators,
  submitValidators,
};
