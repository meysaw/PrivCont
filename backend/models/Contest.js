const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        inviteCode: {
            type: String,
            required: true,
            unique: true
        },

        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        problems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Problem"
            }
        ],

        startTime: {
            type: Date
        },

        endTime: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Contest", contestSchema);