const Submission = require("../models/Submission");
const Contest = require("../models/Contest");
const Problem = require("../models/Problem");
const { judgeSubmission } = require("../services/judgeService");

const createSubmission = async (req, res) => {
    try {
        const { contestId, problemId, code, language } = req.body;

        if (!contestId || !problemId || !code || !language) {
            return res.status(400).json({
                message: "Contest, problem, code and language are required"
            });
        }
        const contest = await Contest.findById(contestId);

        if (!contest) {
            return res.status(404).json({
                message: "Contest not found"
            });
        }

       
        const isParticipant = contest.participants.some(
            participant =>
                participant.toString() === req.userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({
                message: "You are not a participant in this contest"
            });
        }

        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({
                message: "Problem not found"
            });
        }

      
        const problemBelongsToContest = contest.problems.some(
            problem =>
                problem.toString() === problemId.toString()
        );

        if (!problemBelongsToContest) {
            return res.status(400).json({
                message: "This problem does not belong to this contest"
            });
        }

       const submission = await Submission.create({
    user: req.userId,
    contest: contestId,
    problem: problemId,
    code,
    language,
    status: "Pending",
    score: 0,
    testsPassed: 0,
    testsTotal: problem.testCases.length
});

const result = await judgeSubmission(
    code,
    language,
    problem.testCases,
    problem.points
);

submission.status = result.status;
submission.score = result.score;
submission.testsPassed = result.testsPassed;
submission.testsTotal = result.testsTotal;

await submission.save();

res.status(201).json({
    message: "Submission judged",
    submission
});

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createSubmission
};