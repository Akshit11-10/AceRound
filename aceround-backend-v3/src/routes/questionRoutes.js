const express = require("express");
const { listRoles } = require("../controllers/questionController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/roles", protect, listRoles);

module.exports = router;
