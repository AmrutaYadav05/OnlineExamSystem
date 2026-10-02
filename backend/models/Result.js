const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        test: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test",
            required: true
        },

        score: {
            type: Number,
            required: true
        },

        totalMarks: {
            type: Number,
            required: true
        },

        answers: [
            {
                question: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Question"
                },

                selectedAnswer: {
                    type: String
                },

                correctAnswer: {
                    type: String
                },

                isCorrect: {
                    type: Boolean
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Result",
    resultSchema
);