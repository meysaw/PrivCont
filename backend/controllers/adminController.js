const User = require("../models/User");
const Contest = require("../models/Contest");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");

const getStats = async (req, res) => {
    try {
        const [userCount, contestCount, problemCount, submissionCount] =
            await Promise.all([
                User.countDocuments(),
                Contest.countDocuments(),
                Problem.countDocuments(),
                Submission.countDocuments()
            ]);

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("username email createdAt");

        const recentContests = await Contest.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("host", "username")
            .select("name inviteCode host createdAt");

        res.status(200).json({
            stats: { userCount, contestCount, problemCount, submissionCount },
            recentUsers,
            recentContests
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllProblems = async (req, res) => {
    try {
        const problems = await Problem.find()
            .select("-testCases")
            .sort({ createdAt: -1 });

        res.status(200).json({ problems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProblem = async (req, res) => {
    try {
        const {
            title,
            description,
            difficulty,
            points,
            inputFormat,
            outputFormat,
            constraints,
            testCases,
            tags
        } = req.body;

        if (
            !title ||
            !description ||
            !difficulty ||
            points === undefined ||
            !inputFormat ||
            !outputFormat ||
            !constraints
        ) {
            return res.status(400).json({
                message:
                    "Title, description, difficulty, points, input format, output format and constraints are required"
            });
        }

        if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
            return res.status(400).json({ message: "Invalid difficulty" });
        }

        if (!Array.isArray(testCases) || testCases.length === 0) {
            return res.status(400).json({
                message: "At least one test case is required"
            });
        }

        const problem = await Problem.create({
            title,
            description,
            difficulty,
            points: Number(points),
            inputFormat,
            outputFormat,
            constraints,
            testCases,
            tags: tags || []
        });

        res.status(201).json({
            message: "Problem created successfully",
            problem
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProblem = async (req, res) => {
    try {
        const { problemId } = req.params;

        const inUse = await Contest.findOne({ problems: problemId });
        if (inUse) {
            return res.status(400).json({
                message: "Cannot delete a problem that's used in an existing contest"
            });
        }

        const problem = await Problem.findByIdAndDelete(problemId);

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.status(200).json({ message: "Problem deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStats, getAllProblems, createProblem, deleteProblem };