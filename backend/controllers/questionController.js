const Question = require("../models/Question");
const Test = require("../models/Test");


// =====================================
// CREATE QUESTION
// =====================================

const createQuestion = async (req, res) => {

    try {

        const {
            test,
            questionText,
            options,
            correctAnswer,
            marks
        } = req.body;


        if (
            !test ||
            !questionText ||
            !options ||
            !correctAnswer
        ) {

            return res.status(400).json({
                message: "Please provide all required fields"
            });

        }


        const existingTest =
            await Test.findById(test);


        if (!existingTest) {

            return res.status(404).json({
                message: "Test not found"
            });

        }


        const question =
            await Question.create({
                test,
                questionText,
                options,
                correctAnswer,
                marks: marks || 1
            });


        existingTest.totalMarks +=
            marks || 1;

        await existingTest.save();


        res.status(201).json({
            message: "Question created successfully",
            question
        });


    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// =====================================
// GET QUESTIONS OF A TEST
// =====================================

const getQuestionsByTest = async (req, res) => {

    try {

        const { testId } = req.params;


        const test =
            await Test.findById(testId);


        if (!test) {

            return res.status(404).json({
                message: "Test not found"
            });

        }


        const questions =
            await Question.find({
                test: testId
            }).sort({
                createdAt: 1
            });


        res.json({
            count: questions.length,
            questions
        });


    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// =====================================
// UPDATE QUESTION
// =====================================

const updateQuestion = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            questionText,
            options,
            correctAnswer,
            marks
        } = req.body;


        const question =
            await Question.findById(id);


        if (!question) {

            return res.status(404).json({
                message: "Question not found"
            });

        }


        const oldMarks = question.marks;


        question.questionText =
            questionText;

        question.options =
            options;

        question.correctAnswer =
            correctAnswer;

        question.marks =
            marks;


        await question.save();


        // Update test total marks

        const test =
            await Test.findById(
                question.test
            );


        if (test) {

            test.totalMarks =
                test.totalMarks -
                oldMarks +
                marks;

            await test.save();

        }


        res.json({
            message: "Question updated successfully",
            question
        });


    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


// =====================================
// DELETE QUESTION
// =====================================

const deleteQuestion = async (req, res) => {

    try {

        const { id } = req.params;


        const question =
            await Question.findById(id);


        if (!question) {

            return res.status(404).json({
                message: "Question not found"
            });

        }


        const test =
            await Test.findById(
                question.test
            );


        if (test) {

            test.totalMarks -=
                question.marks;

            await test.save();

        }


        await Question.findByIdAndDelete(id);


        res.json({
            message: "Question deleted successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


module.exports = {
    createQuestion,
    getQuestionsByTest,
    updateQuestion,
    deleteQuestion
};