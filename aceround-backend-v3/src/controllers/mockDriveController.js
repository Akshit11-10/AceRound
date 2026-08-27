const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const MockDrive = require("../models/MockDrive");
const { generateQuestions } = require("../services/aiQuestionService");

const MCQ_QUESTION_COUNT = 10;
const MCQ_PASS_PERCENT = 60;

// @route POST /api/mock-drive/start
// Body: either { source: "role", role: "Frontend Developer" }
//    or { source: "resume", resumeText: "<extracted text>" }
// (resumeText is expected to already come from the existing
//  POST /api/resume/extract endpoint — this route does not parse files itself)
const startMockDrive = asyncHandler(async (req, res) => {
  const { source, role, resumeText } = req.body;

  if (!["resume", "role"].includes(source)) {
    throw new ApiError(400, "source must be either 'resume' or 'role'.");
  }

  if (source === "role") {
    if (!role || typeof role !== "string" || !role.trim()) {
      throw new ApiError(400, "role is required when source is 'role'.");
    }
  }

  if (source === "resume") {
    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
      throw new ApiError(
        400,
        "resumeText is required when source is 'resume'. Extract it first via /api/resume/extract."
      );
    }
  }

  const drive = await MockDrive.create({
    user: req.user._id,
    source,
    role: source === "role" ? role.trim() : null,
    resumeText: source === "resume" ? resumeText.trim().slice(0, 6000) : null,
    currentStage: "mcq",
    status: "in-progress",
  });

  res.status(201).json({ success: true, drive: drive.toPublicJSON() });
});

// @route GET /api/mock-drive/:id
const getMockDrive = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  res.json({ success: true, drive: drive.toPublicJSON() });
});

// @route GET /api/mock-drive
// Lists the logged-in user's mock drives, most recent first.
const listMockDrives = asyncHandler(async (req, res) => {
  const drives = await MockDrive.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ success: true, drives: drives.map((d) => d.toPublicJSON()) });
});

// @route POST /api/mock-drive/:id/mcq/start
// Generates (or regenerates, on retry) MCQ questions for this drive's
// source (role or resume) and stores them server-side. Returns only the
// question text + options — never the correct answers.
const startMcq = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "mcq") {
    throw new ApiError(400, `MCQ round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  const params =
    drive.source === "resume"
      ? { mode: "resume", resumeText: drive.resumeText, count: MCQ_QUESTION_COUNT }
      : { mode: "role", role: drive.role, count: MCQ_QUESTION_COUNT };

  const { questions } = await generateQuestions(params);

  drive.mcqQuestions = questions.map((q, index) => ({
    questionId: `mcq-${index + 1}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));
  // Reset any previous result on this drive when (re)starting the round.
  drive.mcqResult = { score: null, passed: null, weakTopics: [] };
  await drive.save();

  res.json({ success: true, questions: drive.toPublicMcqQuestions() });
});

// @route POST /api/mock-drive/:id/mcq/submit
// Body: { answers: { [questionId]: selectedOptionIndex } }
const submitMcq = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "mcq") {
    throw new ApiError(400, `MCQ round is not active for this drive (current stage: ${drive.currentStage}).`);
  }
  if (!drive.mcqQuestions.length) {
    throw new ApiError(400, "No MCQ questions to submit. Call /mcq/start first.");
  }

  const answers = req.body.answers || {};
  let correctCount = 0;
  const weakTopics = [];

  for (const q of drive.mcqQuestions) {
    const selected = answers[q.questionId];
    if (selected === q.correctAnswer) {
      correctCount += 1;
    } else {
      // No formal topic-tagging from the AI yet, so we store the question
      // text itself as a "weak area" — good enough to hint the AI interview
      // (Phase 3) toward topics this candidate struggled with.
      weakTopics.push(q.question.slice(0, 140));
    }
  }

  const score = Math.round((correctCount / drive.mcqQuestions.length) * 100);
  const passed = score >= MCQ_PASS_PERCENT;

  drive.mcqResult = { score, passed, weakTopics };
  if (passed) {
    drive.currentStage = "coding";
  }
  await drive.save();

  res.json({
    success: true,
    score,
    passed,
    passMark: MCQ_PASS_PERCENT,
    correctCount,
    totalQuestions: drive.mcqQuestions.length,
    drive: drive.toPublicJSON(),
  });
});

module.exports = { startMockDrive, getMockDrive, listMockDrives, startMcq, submitMcq };
