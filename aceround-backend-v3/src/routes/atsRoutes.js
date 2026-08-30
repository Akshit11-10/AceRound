const express = require("express");
const { protect } = require("../middleware/auth");
const { analyzeResume } = require("../controllers/atsController");

const router = express.Router();

router.use(protect);

router.post("/analyze", analyzeResume);

module.exports = router;
