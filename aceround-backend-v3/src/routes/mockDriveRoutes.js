// aceround-backend-v3/src/routes/mockDriveRoutes.js
const express = require("express");
const { protect } = require("../middleware/auth");
const {
  startMockDrive,
  getMockDrive,
  listMockDrives,
} = require("../controllers/mockDriveController");

const router = express.Router();

router.use(protect);

router.get("/", listMockDrives);
router.post("/start", startMockDrive);
router.get("/:id", getMockDrive);

module.exports = router;