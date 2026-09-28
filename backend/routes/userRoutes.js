const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getMe, getMyStats } = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/me/stats", protect, getMyStats);

module.exports = router;