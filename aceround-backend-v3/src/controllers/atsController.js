const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { analyzeResumeAts } = require("../services/atsAnalysisService");

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

module.exports = { analyzeResume };
