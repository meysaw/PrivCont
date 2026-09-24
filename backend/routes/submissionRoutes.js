const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createSubmission
} = require("../controllers/submissionController");

const router = express.Router();

router.post("/", protect, createSubmission);

module.exports = router;