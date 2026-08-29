const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const MockDrive = require("../models/MockDrive");
const { generateQuestions } = require("../services/aiQuestionService");
const { getDsaProblems, getDsaProblemById, CODING_PASS_COUNT } = require("../data/dsaProblems");
const { runAgainstTestCases } = require("../services/judge0Service");

const MCQ_QUESTION_COUNT = 30;
const MCQ_PASS_PERCENT = 70;

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
      ? { mode: "resume", resumeText: drive.resumeText }
      : { mode: "role", role: drive.role };

  // The AI sometimes returns fewer valid questions than asked (some get
  // dropped during validation). Keep asking for the shortfall until we
  // have exactly MCQ_QUESTION_COUNT, de-duping by question text.
  const collected = [];
  const seen = new Set();
  let attempts = 0;
  while (collected.length < MCQ_QUESTION_COUNT && attempts < 4) {
    attempts += 1;
    const remaining = MCQ_QUESTION_COUNT - collected.length;
    const { questions } = await generateQuestions({ ...params, count: remaining + 3 });
    for (const q of questions) {
      const key = q.question.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      collected.push(q);
      if (collected.length === MCQ_QUESTION_COUNT) break;
    }
  }

  if (collected.length < MCQ_QUESTION_COUNT) {
    throw new ApiError(502, "Could not generate enough questions right now. Please try again.");
  }

  drive.mcqQuestions = collected.map((q, index) => ({
    questionId: `mcq-${index + 1}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));
  // Reset any previous result on this drive when (re)starting the round.
  drive.mcqResult = { score: null, passed: null, weakTopics: [] };
  await drive.save();

  res.json({
    success: true,
    questions: drive.toPublicMcqQuestions(),
    timeLimitSeconds: drive.mcqQuestions.length * 30, // 0.5 min per question
  });
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

// @route GET /api/mock-drive/:id/coding
// Returns the fixed DSA problem bank (no test cases/expected output leaked).
const getCodingProblems = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "coding") {
    throw new ApiError(400, `Coding round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  const problems = getDsaProblems().map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    starterCode: p.starterCode,
    // Show the first test case as a visible example; the rest stay hidden.
    example: { input: p.testCases[0].stdin, output: p.testCases[0].expectedOutput },
  }));

  res.json({ success: true, problems, passCount: CODING_PASS_COUNT, totalCount: problems.length });
});

// @route POST /api/mock-drive/:id/coding/submit
// Body: { submissions: [{ problemId, language, sourceCode }] }
const submitCoding = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "coding") {
    throw new ApiError(400, `Coding round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  const submissions = Array.isArray(req.body.submissions) ? req.body.submissions : [];
  if (submissions.length === 0) {
    throw new ApiError(400, "No submissions provided.");
  }

  const results = [];
  let solvedCount = 0;

  for (const sub of submissions) {
    const problem = getDsaProblemById(sub.problemId);
    if (!problem) {
      results.push({ problemId: sub.problemId, solved: false, error: "Unknown problem." });
      continue;
    }
    if (!sub.sourceCode || !sub.sourceCode.trim()) {
      results.push({ problemId: sub.problemId, solved: false, error: "No code submitted." });
      continue;
    }

    const caseResults = await runAgainstTestCases({
      sourceCode: sub.sourceCode,
      language: sub.language || "javascript",
      testCases: problem.testCases,
    });
    const allPassed = caseResults.every((r) => r.passed);
    if (allPassed) solvedCount += 1;

    results.push({
      problemId: sub.problemId,
      solved: allPassed,
      caseResults: caseResults.map((r) => ({ passed: r.passed, error: r.error || null })),
    });
  }

  const totalCount = getDsaProblems().length;
  const passed = solvedCount >= CODING_PASS_COUNT;

  drive.codingResult = { solvedCount, totalCount, passed };
  if (passed) {
    drive.currentStage = "interview";
  }
  await drive.save();

  res.json({
    success: true,
    solvedCount,
    totalCount,
    passCount: CODING_PASS_COUNT,
    passed,
    results,
    drive: drive.toPublicJSON(),
  });
});

module.exports = {
  startMockDrive,
  getMockDrive,
  listMockDrives,
  startMcq,
  submitMcq,
  getCodingProblems,
  submitCoding,
};
