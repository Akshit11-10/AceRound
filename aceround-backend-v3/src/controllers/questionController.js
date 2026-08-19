const asyncHandler = require("../utils/asyncHandler");
const { getAvailableRoles } = require("../services/aiQuestionService");

// @route GET /api/questions/roles
// Returns the list of roles that have a guaranteed static fallback bank.
// The AI provider can still generate questions for any custom role string too.
const listRoles = asyncHandler(async (_req, res) => {
  res.json({ success: true, roles: getAvailableRoles() });
});

module.exports = { listRoles };
