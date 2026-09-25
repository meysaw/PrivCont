const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createSubmission
,getMySubmissions} = require("../controllers/submissionController");

const router = express.Router();

router.post("/", protect, createSubmission);
router.get("/my", protect, getMySubmissions);

module.exports = router;