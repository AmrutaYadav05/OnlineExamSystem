const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        test: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test",
            required: true
        },

        questionText: {
            type: String,
            required: true
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length >= 2;
                },
                message: "At least 2 options are required"
            }
        },

        correctAnswer: {
            type: String,
            required: true
        },

        marks: {
            type: Number,
            required: true,
            default: 1
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Question", questionSchema);