const multer = require("multer");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "text/plain"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new ApiError(400, "Only PDF or .txt resumes are supported."));
    }
    cb(null, true);
  },
}).single("resume");

// @route POST /api/resume/extract
// Accepts a PDF or .txt resume upload and returns extracted plain text,
// which the frontend then sends along with /interviews/start to tailor
// AI-generated questions to the candidate's actual background.
// Nothing is stored — the file is processed in memory only.
const extractResumeText = asyncHandler(async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError || err) {
      return next(err instanceof multer.MulterError ? new ApiError(400, err.message) : err);
    }
    if (!req.file) {
      return next(new ApiError(400, "No resume file uploaded."));
    }

    try {
      let text;
      if (req.file.mimetype === "application/pdf") {
        const pdfParse = require("pdf-parse");
        const parsed = await pdfParse(req.file.buffer);
        text = parsed.text;
      } else {
        text = req.file.buffer.toString("utf-8");
      }

      text = text.replace(/\s+/g, " ").trim();
      if (!text) {
        throw new ApiError(400, "Could not extract any text from that file.");
      }

      res.json({ success: true, text: text.slice(0, 6000) });
    } catch (parseErr) {
      next(parseErr instanceof ApiError ? parseErr : new ApiError(400, "Could not read that file. Try a different PDF or a .txt file."));
    }
  });
});

module.exports = { extractResumeText };
