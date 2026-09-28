const Contest = require("../models/Contest");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const createContest = async (req, res) => {
    try {
        const {
            name,
            difficulty,
            problemCount,
            startTime,
            durationMinutes
        } = req.body;
        const parsedStart = new Date(startTime);
const duration = Number(durationMinutes);

if (isNaN(parsedStart.getTime())) {
    return res.status(400).json({ message: "Invalid start time" });
}

if (!Number.isInteger(duration) || duration <= 0) {
    return res.status(400).json({ message: "Duration must be a positive number of minutes" });
}

const parsedEnd = new Date(parsedStart.getTime() + duration * 60000);
   

        if (!name || !difficulty || problemCount === undefined||!startTime||!durationMinutes) {
            return res.status(400).json({
                message: "Contest name, difficulty and problem count are required"
            });
        }

        if (!["Easy", "Medium", "Hard"].includes(difficulty)) {
            return res.status(400).json({
                message: "Invalid difficulty"
            });
        }

        const count = Number(problemCount);

        if (!Number.isInteger(count) || count <= 0) {
            return res.status(400).json({
                message: "Problem count must be a positive integer"
            });
        }

        const problems = await Problem.aggregate([
            {
                $match: {
                    difficulty: difficulty
                }
            },
            {
                $sample: {
                    size: count
                }
            }
        ]);

        if (problems.length < count) {
            return res.status(400).json({
                message: `Not enough ${difficulty} problems available`
            });
        }

        const inviteCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        const contest = await Contest.create({
          name,
          inviteCode,
          host: req.userId,
          participants: [req.userId],
          problems: problems.map(problem => problem._id),
          startTime: parsedStart,
          durationMinutes: duration,
          endTime: parsedEnd
        });

        res.status(201).json({
            message: "Contest created successfully",
            contest
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};
const joinContest=async(req,res)=>{
    try {
        const{inviteCode}=req.body;
        if(!inviteCode){
            return res.status(400).json({
                message:"invite code is required"
            });
        }
        const contest = await Contest.findOne({
            inviteCode:inviteCode.toUpperCase()
        });
        if(!contest){
            return res.status(404).json({
                message:"contest not found"
            })
        }
        const alreadyJoined = contest.participants.some(
    participant => participant && participant.toString() === req.userId.toString()
);

        if(alreadyJoined){
            return res.status(400).json({
                message:"you are already in this contest"
            });
        }
        if (new Date() > contest.endTime) {
    return res.status(400).json({
        message: "This contest has already ended"
    });
}
        contest.participants.push(req.userId);
        await contest.save();
        res.status(200).json({
            message:"joined contest successfully",
            contest
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        });
    }
}
const getContestProblems = async (req, res) => {
    try {
        const { contestId } = req.params;

        const contest = await Contest.findById(contestId).populate("problems");

        if (!contest) {
            return res.status(404).json({ message: "Contest not found" });
        }

        const isParticipant = contest.participants.some(
            (participant) => participant.toString() === req.userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({
                message: "You are not a participant in this contest"
            });
        }

        const now = new Date();

        if (now < contest.startTime) {
            return res.status(403).json({ message: "This contest hasn't started yet" });
        }

        if (now > contest.endTime) {
            return res.status(403).json({ message: "This contest has ended" });
        }

        const problems = contest.problems.map((p) => ({
            _id: p._id,
            title: p.title,
            description: p.description,
            difficulty: p.difficulty,
            points: p.points,
            inputFormat: p.inputFormat,
            outputFormat: p.outputFormat,
            constraints: p.constraints,
            tags: p.tags,
            examples: p.testCases
                .filter((tc) => tc.isHidden === false)
                .map((tc) => ({ input: tc.input, output: tc.output }))
        }));

        res.status(200).json({ problems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getLeaderboard = async (req, res) => {
    try {
        const { contestId } = req.params;

        const contest = await Contest.findById(contestId)
            .populate("participants", "username");

        if (!contest) {
            return res.status(404).json({
                message: "Contest not found"
            });
        }

        const isParticipant = contest.participants.some(
            participant =>
                participant._id.toString() === req.userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({
                message: "You are not a participant in this contest"
            });
        }

        const scores = await Submission.aggregate([
            {
                $match: {
                    contest: contest._id,
                    status: "Accepted"
                }
            },
            {
                $group: {
                    _id: {
                        user: "$user",
                    problem: "$problem"
                    },
                    score: {
                        $max: "$score"
                    }
                }
            },
            {
                   $group: {
                     _id: "$_id.user",
                          score: {
                     $sum: "$score"
                     }
               } 
            }
        ]
    
    );

        const scoreMap = {};

        scores.forEach(entry => {
            scoreMap[entry._id.toString()] = entry.score;
        });

        const leaderboard = contest.participants.map(participant => ({
            username: participant.username,
            score: scoreMap[participant._id.toString()] || 0
        }));

        leaderboard.sort((a, b) => b.score - a.score);

        leaderboard.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        res.status(200).json({
            leaderboard
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};
const getContest = async (req, res) => {
    try {
        const { contestId } = req.params;

        const contest = await Contest.findById(contestId)
            .populate("host", "username")
            .populate("participants", "username");

        if (!contest) {
            return res.status(404).json({
                message: "Contest not found"
            });
        }

        const isParticipant = contest.participants.some(
            participant =>
                participant._id.toString() === req.userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({
                message: "You are not a participant in this contest"
            });
        }

        res.status(200).json({
            contest: {
                id: contest._id,
                name: contest.name,
                inviteCode: contest.inviteCode,
                host: contest.host.username,
                participantCount: contest.participants.length,
                startTime: contest.startTime,
                endTime: contest.endTime
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};
const getMyContests = async (req, res) => {
    try {
        const contests = await Contest.find({ participants: req.userId })
            .populate("host", "username")
            .sort({ startTime: -1 })
            .select("name host participants startTime endTime");

        res.status(200).json({
            contests: contests.map((c) => ({
                _id: c._id,
                name: c.name,
                host: c.host?.username,
                participantCount: c.participants.length,
                startTime: c.startTime,
                endTime: c.endTime
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports={createContest, joinContest, getContestProblems,getLeaderboard, getContest, getMyContests};