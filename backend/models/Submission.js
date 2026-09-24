const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
    {
        executionTime:{
            type:Number
        },
        memoryUsed:{
            type:Number
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        contest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contest",
            required: true
        },

        problem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true
        },

        code: {
            type: String,
            required: true
        },

        language: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Wrong Answer",
                "Compilation Error",
                "Runtime Error"
            ],
            default: "Pending"
        },

        score: {
            type: Number,
            default: 0
        },
        testsPassed: {
            type: Number,
            default: 0
        },

        testsTotal: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Submission", submissionSchema);