const User = require("../models/User");
const Contest = require("../models/Contest");
const Submission = require("../models/Submission");

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select(
            "username email role createdAt"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyStats = async (req, res) => {
    try {
        const now = new Date();

        const contests = await Contest.find({
            participants: req.userId,
            startTime: { $lte: now }
        }).select("startTime endTime");

        const endedIds = contests
            .filter((c) => c.endTime < now)
            .map((c) => c._id);

        const [scores, submissionCount, acceptedCount] = await Promise.all([
           
            Submission.aggregate([
                { $match: { contest: { $in: endedIds }, status: "Accepted" } },
                {
                    $group: {
                        _id: { contest: "$contest", user: "$user", problem: "$problem" },
                        score: { $max: "$score" }
                    }
                },
                {
                    $group: {
                        _id: { contest: "$_id.contest", user: "$_id.user" },
                        score: { $sum: "$score" }
                    }
                }
            ]),
            Submission.countDocuments({ user: req.userId }),
            Submission.countDocuments({ user: req.userId, status: "Accepted" })
        ]);

        const best = {};
        const mine = {};

        scores.forEach(({ _id, score }) => {
            const contestId = _id.contest.toString();
            if (!best[contestId] || score > best[contestId]) {
                best[contestId] = score;
            }
            if (_id.user.toString() === req.userId.toString()) {
                mine[contestId] = score;
            }
        });

        const contestsWon = endedIds.filter((id) => {
            const contestId = id.toString();
            return mine[contestId] > 0 && mine[contestId] === best[contestId];
        }).length;

        res.status(200).json({
            stats: {
                contestsParticipated: contests.length,
                contestsWon,
                submissionCount,
                acceptedCount
            },
            contestDates: contests.map((c) => c.startTime)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMe, getMyStats };