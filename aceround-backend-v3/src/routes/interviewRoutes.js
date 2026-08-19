const express = require("express");
const {
  startInterview,
  submitInterview,
  listInterviews,
  getInterview,
  startValidators,
  submitValidators,
} = require("../controllers/interviewController");
const { protect } = require("../middleware/auth");
const { aiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.use(protect);

router.get("/", listInterviews);
router.post("/start", aiLimiter, startValidators, startInterview);
router.post("/:id/submit", submitValidators, submitInterview);
router.get("/:id", getInterview);

module.exports = router;
