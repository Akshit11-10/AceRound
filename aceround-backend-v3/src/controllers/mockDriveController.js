// aceround-backend-v3/src/controllers/mockDriveController.js
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const MockDrive = require("../models/MOckDrive");

const startMockDrive = asyncHandler(async (req, res) => {
  const { source, role, resumeText } = req.body;

  if (!["resume", "role"].includes(source)) {
    throw new ApiError(400, "source must be either 'resume' or 'role'.");
  }

  if (source === "role") {
    if (!role || typeof role !== "string" || !role.trim()) {
      throw new ApiError(400, "role is required when source is 'role'.");
    }
  }

  if (source === "resume") {
    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length < 20) {
      throw new ApiError(
        400,
        "resumeText is required when source is 'resume'. Extract it first via /api/resume/extract."
      );
    }
  }

  const drive = await MockDrive.create({
    user: req.user._id,
    source,
    role: source === "role" ? role.trim() : null,
    resumeText: source === "resume" ? resumeText.trim().slice(0, 6000) : null,
    currentStage: "mcq",
    status: "in-progress",
  });

  res.status(201).json({ success: true, drive: drive.toPublicJSON() });
});

const getMockDrive = asyncHandler(async (req, res) => {
  const drive = await MockDrive.findOne({ _id: req.params.id, user: req.user._id });
  if (!drive) {
    throw new ApiError(404, "Mock Drive not found.");
  }
  res.json({ success: true, drive: drive.toPublicJSON() });
});

const listMockDrives = asyncHandler(async (req, res) => {
  const drives = await MockDrive.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ success: true, drives: drives.map((d) => d.toPublicJSON()) });
});

module.exports = { startMockDrive, getMockDrive, listMockDrives };