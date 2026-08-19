const express = require("express");
const { extractResumeText } = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/extract", protect, extractResumeText);

module.exports = router;
