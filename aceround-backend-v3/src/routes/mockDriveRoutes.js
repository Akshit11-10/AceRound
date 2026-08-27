const express = require("express");
const { protect } = require("../middleware/auth");
const {
  startMockDrive,
  getMockDrive,
  listMockDrives,
  startMcq,
  submitMcq,
} = require("../controllers/mockDriveController");

const router = express.Router();

router.use(protect);

router.get("/", listMockDrives);
router.post("/start", startMockDrive);
router.get("/:id", getMockDrive);
router.post("/:id/mcq/start", startMcq);
router.post("/:id/mcq/submit", submitMcq);

module.exports = router;
