const Result = require("../models/Result");
const Test = require("../models/Test");
const Question = require("../models/Question");


// =====================================
// SUBMIT TEST
// =====================================

const submitTest = async (req, res) => {

    try {

        const {
            testId,
            answers
        } = req.body;


        if (!testId || !answers) {

            return res.status(400).json({
                message:
                    "Please provide testId and answers"
            });

        }


        // =====================================
        // CHECK TEST
        // =====================================

        const test =
            await Test.findById(testId);


        if (!test) {

            return res.status(404).json({
                message:
                    "Test not found"
            });

        }


        // =====================================
        // CHECK PREVIOUS ATTEMPT
        // =====================================

        const existingResult =
            await Result.findOne({

                student: req.user.id,

                test: testId

            });


        if (existingResult) {

            return res.status(400).json({

                message:
                    "You have already attempted this test."

            });

        }


        // =====================================
        // CALCULATE SCORE
        // =====================================

        let score = 0;

        const processedAnswers = [];


        for (const answer of answers) {

            const question =
                await Question.findById(
                    answer.questionId
                );


            if (!question) {

                continue;

            }


            // Make sure the question
            // belongs to this test

            if (
                question.test.toString() !==
                testId.toString()
            ) {

                continue;

            }


            const isCorrect =
                question.correctAnswer ===
                answer.selectedAnswer;


            if (isCorrect) {

                score += question.marks;

            }


            processedAnswers.push({
              question: question._id,

              selectedAnswer: answer.selectedAnswer,

              correctAnswer: question.correctAnswer,

              isCorrect,
            });


        }


        // =====================================
        // SAVE RESULT
        // =====================================

        const result =
            await Result.create({

                student:
                    req.user.id,

                test:
                    test._id,

                score,

                totalMarks:
                    test.totalMarks,

                answers:
                    processedAnswers

            });


        // =====================================
        // RESPONSE
        // =====================================

        res.status(201).json({

            message:
                "Test submitted successfully",

            result: {

                id:
                    result._id,

                test:
                    test.title,

                score:
                    result.score,

                totalMarks:
                    result.totalMarks,

                answers:
                    result.answers

            }

        });


    } catch (error) {

        console.error(
            "Submit test error:",
            error
        );


        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================
// GET MY RESULTS
// =====================================

const getMyResults = async (req, res) => {

    try {

        const results =
            await Result.find({

                student:
                    req.user.id

            })
                .populate(
                    "test",
                    "title description duration totalMarks"
                )
                .sort({
                    createdAt: -1
                });


        res.json({

            count:
                results.length,

            results

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


// =====================================
// GET ALL RESULTS
// =====================================

const getAllResults = async (req, res) => {

    try {

        const results =
            await Result.find()
                .populate(
                    "student",
                    "name email"
                )
                .populate(
                    "test",
                    "title totalMarks"
                )
                .sort({
                    createdAt: -1
                });


        res.json({

            count:
                results.length,

            results

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });

    }

};


module.exports = {

    submitTest,

    getMyResults,

    getAllResults

};
