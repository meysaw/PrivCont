const express = require("express");
const protect = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");
const {
    getStats,
    getAllProblems,
    createProblem,
    deleteProblem
} = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", protect, requireAdmin, getStats);
router.get("/problems", protect, requireAdmin, getAllProblems);
router.post("/problems", protect, requireAdmin, createProblem);
router.delete("/problems/:problemId", protect, requireAdmin, deleteProblem);

module.exports = router;