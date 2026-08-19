const express = require("express");
const { getStats, listUsers } = require("../controllers/adminController");
const { protect, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/stats", getStats);
router.get("/users", listUsers);

module.exports = router;
