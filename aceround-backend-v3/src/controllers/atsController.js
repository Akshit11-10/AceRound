const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { analyzeResumeAts, improveResume } = require("../services/atsAnalysisService");

// @route POST /api/ats/analyze
// Body: { resumeText, jobDescription (optional) }
// Standalone feature — independent of the Mock Drive pipeline. Nothing is
// persisted; this can be run any time, any number of times.
const analyzeResume = asyncHandler(async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
    throw new ApiError(400, "resumeText is required. Extract it first via /api/resume/extract.");
  }

  const result = await analyzeResumeAts({
    resumeText: resumeText.trim(),
    jobDescription: jobDescription && typeof jobDescription === "string" ? jobDescription.trim() : null,
  });

  res.json({ success: true, ...result });
});

// @route POST /api/ats/improve
// Body: { resumeText, jobDescription, missingKeywords, formattingIssues, suggestions }
// Takes a prior analysis result and generates an improved resume that
// addresses the identified issues — without fabricating any facts.
const improveResumeHandler = asyncHandler(async (req, res) => {
  const { resumeText, jobDescription, missingKeywords, formattingIssues, suggestions } = req.body;

  if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
    throw new ApiError(400, "resumeText is required.");
  }

  const improvedResumeText = await improveResume({
    resumeText: resumeText.trim(),
    jobDescription: jobDescription && typeof jobDescription === "string" ? jobDescription.trim() : null,
    missingKeywords: Array.isArray(missingKeywords) ? missingKeywords : [],
    formattingIssues: Array.isArray(formattingIssues) ? formattingIssues : [],
    suggestions: Array.isArray(suggestions) ? suggestions : [],
  });

  res.json({ success: true, improvedResumeText });
});

module.exports = { analyzeResume, improveResumeHandler };
