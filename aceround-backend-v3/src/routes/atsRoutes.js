const express = require("express");
const { protect } = require("../middleware/auth");
const { analyzeResume, improveResumeHandler, downloadImprovedDocx } = require("../controllers/atsController");

const router = express.Router();

router.use(protect);

router.post("/analyze", analyzeResume);
router.post("/improve", improveResumeHandler);
router.post("/improve/docx", downloadImprovedDocx);

module.exports = router;
