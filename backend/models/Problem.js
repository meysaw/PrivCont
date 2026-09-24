const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            required: true
        },

        points: {
            type: Number,
            required: true
        },

        inputFormat: {
            type: String,
            required: true
        },

        outputFormat: {
            type: String,
            required: true
        },

        constraints: {
            type: String,
            required: true
        },

        testCases: [
            {
                input: {
                    type: String,
                    required: true
                },

                output: {
                    type: String,
                    required: true
                },

                isHidden: {
                    type: Boolean,
                    default: true
                }
            }
        ],
   tags: [
    {
        type: String
    }
   ]
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Problem", problemSchema);