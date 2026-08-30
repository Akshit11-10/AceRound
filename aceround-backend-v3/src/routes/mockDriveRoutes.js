const express = require("express");
const { protect } = require("../middleware/auth");
const {
  startMockDrive,
  getMockDrive,
  listMockDrives,
  startMcq,
  submitMcq,
  getCodingProblems,
  runCoding,
  submitCoding,
  getInterview,
  startInterview,
  respondInterview,
  finishInterview,
} = require("../controllers/mockDriveController");

const router = express.Router();

router.use(protect);

router.get("/", listMockDrives);
router.post("/start", startMockDrive);
router.get("/:id", getMockDrive);
router.post("/:id/mcq/start", startMcq);
router.post("/:id/mcq/submit", submitMcq);
router.get("/:id/coding", getCodingProblems);
router.post("/:id/coding/run", runCoding);
router.post("/:id/coding/submit", submitCoding);
router.get("/:id/interview", getInterview);
router.post("/:id/interview/start", startInterview);
router.post("/:id/interview/respond", respondInterview);
router.post("/:id/interview/finish", finishInterview);

module.exports = router;
