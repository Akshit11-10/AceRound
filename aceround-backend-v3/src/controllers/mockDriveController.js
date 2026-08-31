const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const MockDrive = require("../models/MockDrive");
const { generateQuestions } = require("../services/aiQuestionService");
const {
  getDsaProblems,
  getDsaProblemById,
  pickRandomProblemIds,
  CODING_PASS_COUNT,
  SECONDS_PER_PROBLEM,
} = require("../data/dsaProblems");
const { gradeSubmission } = require("../services/judge0Service");
const {
  startInterviewConversation,
  continueInterviewConversation,
  generateInterviewFeedback,
} = require("../services/interviewChatService");

const INTERVIEW_TIME_LIMIT_SECONDS = 20 * 60; // 20 min, within the 15-30 min range

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
    currentStage: "aptitude",
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

const APTITUDE_QUESTION_COUNT = 20;
const APTITUDE_PASS_PERCENT = 60;

// @route POST /api/mock-drive/:id/aptitude/start
// Generates a generic Quant+Reasoning+Verbal mix (no role/resume needed —
// same for everyone). This is the very first round, before MCQ.
const startAptitude = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "aptitude") {
    throw new ApiError(400, `Aptitude round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  const collected = [];
  const seen = new Set();
  let attempts = 0;
  while (collected.length < APTITUDE_QUESTION_COUNT && attempts < 4) {
    attempts += 1;
    const remaining = APTITUDE_QUESTION_COUNT - collected.length;
    const { questions } = await generateQuestions({ mode: "aptitude", count: remaining + 3 });
    for (const q of questions) {
      const key = q.question.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      collected.push(q);
      if (collected.length === APTITUDE_QUESTION_COUNT) break;
    }
  }

  if (collected.length < APTITUDE_QUESTION_COUNT) {
    throw new ApiError(502, "Could not generate enough questions right now. Please try again.");
  }

  drive.aptitudeQuestions = collected.map((q, index) => ({
    questionId: `apt-${index + 1}`,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
  }));
  drive.aptitudeResult = { score: null, passed: null };
  await drive.save();

  res.json({
    success: true,
    questions: drive.toPublicAptitudeQuestions(),
    timeLimitSeconds: drive.aptitudeQuestions.length * 45, // 45 sec/question — apti/verbal/reasoning need a bit more time than pure MCQ
  });
});

// @route POST /api/mock-drive/:id/aptitude/submit
// Body: { answers: { [questionId]: selectedOptionIndex } }
const submitAptitude = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "aptitude") {
    throw new ApiError(400, `Aptitude round is not active for this drive (current stage: ${drive.currentStage}).`);
  }
  if (!drive.aptitudeQuestions.length) {
    throw new ApiError(400, "No aptitude questions to submit. Call /aptitude/start first.");
  }

  const answers = req.body.answers || {};
  let correctCount = 0;

  for (const q of drive.aptitudeQuestions) {
    if (answers[q.questionId] === q.correctAnswer) correctCount += 1;
  }

  const score = Math.round((correctCount / drive.aptitudeQuestions.length) * 100);
  const passed = score >= APTITUDE_PASS_PERCENT;

  drive.aptitudeResult = { score, passed };
  if (passed) {
    drive.currentStage = "mcq";
  }
  await drive.save();

  res.json({
    success: true,
    score,
    passed,
    passMark: APTITUDE_PASS_PERCENT,
    correctCount,
    totalQuestions: drive.aptitudeQuestions.length,
    drive: drive.toPublicJSON(),
  });
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
// Randomly picks (once per drive, persisted) a fixed-size subset of basic
// DSA problems from the larger pool, so each new drive gets a different
// mix. Returns the user's existing per-problem progress (so a page refresh
// doesn't lose solved badges), and how long the whole round should be timed for.
const getCodingProblems = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "coding") {
    throw new ApiError(400, `Coding round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  if (!drive.codingProblemIds || drive.codingProblemIds.length === 0) {
    drive.codingProblemIds = pickRandomProblemIds();
    await drive.save();
  }

  const problems = drive.codingProblemIds
    .map((id) => getDsaProblemById(id))
    .filter(Boolean)
    .map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      starterCode: p.starterCode,
      examples: p.testCases.map((tc) => ({
        input: JSON.stringify(tc.args[0]),
        output: typeof tc.expected === "boolean" ? (tc.expected ? "true" : "false") : String(tc.expected),
      })),
    }));

  res.json({
    success: true,
    problems,
    passCount: CODING_PASS_COUNT,
    totalCount: problems.length,
    timeLimitSeconds: problems.length * SECONDS_PER_PROBLEM,
    progress: drive.codingProgress || {},
  });
});

// @route POST /api/mock-drive/:id/coding/run
// Body: { problemId, language, sourceCode }
// Quick, non-persisted check against just the visible example test case.
const runCoding = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "coding") {
    throw new ApiError(400, `Coding round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  const { problemId, language, sourceCode } = req.body;
  const problem = getDsaProblemById(problemId);
  if (!problem) throw new ApiError(400, "Unknown problem.");
  if (!sourceCode || !sourceCode.trim()) throw new ApiError(400, "No code submitted.");

  const isFunctionOnly = language === "javascript" || language === "python";
  const testCasesForRun = isFunctionOnly ? problem.testCases.slice(0, 1) : problem.testCases;

  const grading = await gradeSubmission({
    userCode: sourceCode,
    language,
    functionName: problem.functionName?.[language],
    testCases: testCasesForRun,
  });

  res.json({ success: true, ...grading });
});

// @route POST /api/mock-drive/:id/coding/submit
// Body: { problemId, language, sourceCode }
// Full grading against every test case for this one problem. Persists the
// per-problem result, recomputes the aggregate, and unlocks the interview
// round once CODING_PASS_COUNT problems are solved.
const submitCoding = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "coding") {
    throw new ApiError(400, `Coding round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  const { problemId, language, sourceCode } = req.body;
  if (!drive.codingProblemIds.includes(problemId)) {
    throw new ApiError(400, "This problem is not part of this drive's coding round.");
  }
  const problem = getDsaProblemById(problemId);
  if (!problem) throw new ApiError(400, "Unknown problem.");
  if (!sourceCode || !sourceCode.trim()) throw new ApiError(400, "No code submitted.");

  const grading = await gradeSubmission({
    userCode: sourceCode,
    language,
    functionName: problem.functionName?.[language],
    testCases: problem.testCases,
  });

  const progress = { ...(drive.codingProgress || {}) };
  progress[problemId] = { solved: grading.passed, submittedAt: new Date() };
  drive.codingProgress = progress;

  const totalCount = drive.codingProblemIds.length;
  const solvedCount = Object.values(progress).filter((p) => p.solved).length;
  const passed = solvedCount >= CODING_PASS_COUNT;

  drive.codingResult = { solvedCount, totalCount, passed };
  if (passed) {
    drive.currentStage = "interview";
  }
  await drive.save();

  res.json({
    success: true,
    problemId,
    passed: grading.passed,
    lineResults: grading.lineResults,
    error: grading.error,
    solvedCount,
    totalCount,
    passCount: CODING_PASS_COUNT,
    roundPassed: passed,
    drive: drive.toPublicJSON(),
  });
});

// @route GET /api/mock-drive/:id/interview
// Returns the existing transcript (for resuming after a refresh), whether
// the round is finished, and the time limit for the round.
const getInterview = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "interview" && drive.currentStage !== "completed") {
    throw new ApiError(400, `Interview round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  res.json({
    success: true,
    transcript: drive.interviewTranscript,
    isFinished: drive.currentStage === "completed",
    interviewResult: drive.interviewResult,
    timeLimitSeconds: INTERVIEW_TIME_LIMIT_SECONDS,
  });
});

// @route POST /api/mock-drive/:id/interview/start
// Generates the interviewer's opening message. If a transcript already
// exists (e.g. page refresh), just returns it instead of starting over.
const startInterview = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "interview") {
    throw new ApiError(400, `Interview round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  if (drive.interviewTranscript.length > 0) {
    return res.json({ success: true, transcript: drive.interviewTranscript, resumed: true });
  }

  const { message } = await startInterviewConversation({
    source: drive.source,
    role: drive.role,
    resumeText: drive.resumeText,
    weakTopics: drive.mcqResult?.weakTopics,
  });

  drive.interviewTranscript = [{ role: "ai", text: message, at: new Date() }];
  await drive.save();

  res.json({ success: true, transcript: drive.interviewTranscript, resumed: false });
});

// @route POST /api/mock-drive/:id/interview/respond
// Body: { message } — the candidate's answer (from speech-to-text or typed).
const respondInterview = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage !== "interview") {
    throw new ApiError(400, `Interview round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  const userMessage = (req.body.message || "").trim();
  if (!userMessage) {
    throw new ApiError(400, "message is required.");
  }

  drive.interviewTranscript.push({ role: "user", text: userMessage, at: new Date() });

  const { message, done } = await continueInterviewConversation({
    source: drive.source,
    role: drive.role,
    resumeText: drive.resumeText,
    weakTopics: drive.mcqResult?.weakTopics,
    transcript: drive.interviewTranscript,
  });

  drive.interviewTranscript.push({ role: "ai", text: message, at: new Date() });

  let interviewResult = null;
  if (done) {
    interviewResult = await generateInterviewFeedback({
      source: drive.source,
      role: drive.role,
      transcript: drive.interviewTranscript,
    });
    drive.interviewResult = interviewResult;
    drive.currentStage = "completed";
    drive.status = "completed";
    drive.completedAt = new Date();
  }

  await drive.save();

  res.json({
    success: true,
    transcript: drive.interviewTranscript,
    isFinished: done,
    interviewResult,
    drive: drive.toPublicJSON(),
  });
});

// @route POST /api/mock-drive/:id/interview/finish
// Force-ends the round (used when the timer runs out) and grades whatever
// transcript exists so far.
const finishInterview = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  if (drive.currentStage === "completed") {
    return res.json({ success: true, interviewResult: drive.interviewResult, drive: drive.toPublicJSON() });
  }
  if (drive.currentStage !== "interview") {
    throw new ApiError(400, `Interview round is not active for this drive (current stage: ${drive.currentStage}).`);
  }

  const interviewResult = await generateInterviewFeedback({
    source: drive.source,
    role: drive.role,
    transcript: drive.interviewTranscript,
  });

  drive.interviewResult = interviewResult;
  drive.currentStage = "completed";
  drive.status = "completed";
  drive.completedAt = new Date();
  await drive.save();

  res.json({ success: true, interviewResult, drive: drive.toPublicJSON() });
});

module.exports = {
  startMockDrive,
  getMockDrive,
  listMockDrives,
  startAptitude,
  submitAptitude,
  startMcq,
  submitMcq,
  getCodingProblems,
  runCoding,
  submitCoding,
  getInterview,
  startInterview,
  respondInterview,
  finishInterview,
};
