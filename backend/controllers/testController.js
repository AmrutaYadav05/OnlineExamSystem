const Test = require("../models/Test");
const Question = require("../models/Question");
const Result = require("../models/Result");


// =====================================
// CREATE TEST
// =====================================

const createTest = async (req, res) => {

    try {

        const {
            title,
            description,
            duration
        } = req.body;


        if (!title || !description || !duration) {

            return res.status(400).json({
                message:
                    "Please provide title, description and duration"
            });

        }


        const test = await Test.create({

            title,
            description,
            duration,

            totalMarks: 0,

            createdBy: req.user.id

        });


        res.status(201).json({

            message:
                "Test created successfully",

            test

        });


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

};


// =====================================
// GET ALL TESTS
// =====================================

const getAllTests = async (req, res) => {

    try {

        const tests = await Test.find()
            .select(
                "title description duration totalMarks createdAt"
            )
            .sort({
                createdAt: -1
            });


        const testsWithQuestionCount =
            await Promise.all(

                tests.map(async (test) => {

                    const questionCount =
                        await Question.countDocuments({
                            test: test._id
                        });


                    return {

                        ...test.toObject(),

                        questionCount

                    };

                })

            );


        res.json({

            count:
                testsWithQuestionCount.length,

            tests:
                testsWithQuestionCount

        });


    } catch (error) {

        res.status(500).json({

            message: "Server error",

            error: error.message

        });

    }

};


// =====================================
// GET TEST BY ID
// =====================================

const getTestById = async (req, res) => {

    try {

        const test =
            await Test.findById(
                req.params.id
            );


        if (!test) {

            return res.status(404).json({

                message: "Test not found"

            });

        }


        const questions =
            await Question.find({

                test: test._id

            }).select(
                "-correctAnswer"
            );


        res.json({

            test: {

                id: test._id,

                title: test.title,

                description:
                    test.description,

                duration:
                    test.duration,

                totalMarks:
                    test.totalMarks

            },

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
// UPDATE TEST
// =====================================

const updateTest = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            title,
            description,
            duration
        } = req.body;


        if (!title || !description || !duration) {

            return res.status(400).json({

                message:
                    "Please provide title, description and duration"

            });

        }


        const test =
            await Test.findById(id);


        if (!test) {

            return res.status(404).json({

                message:
                    "Test not found"

            });

        }


        test.title =
            title;

        test.description =
            description;

        test.duration =
            Number(duration);


        await test.save();


        res.json({

            message:
                "Test updated successfully",

            test

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Server error",

            error: error.message

        });

    }

};


// =====================================
// DELETE TEST
// =====================================

const deleteTest = async (req, res) => {

    try {

        const { id } = req.params;


        const test =
            await Test.findById(id);


        if (!test) {

            return res.status(404).json({

                message:
                    "Test not found"

            });

        }


        // Check whether students have
        // already attempted this test

        const existingResults =
            await Result.countDocuments({

                test: id

            });


        if (existingResults > 0) {

            return res.status(400).json({

                message:
                    "This test cannot be deleted because students have already attempted it."

            });

        }


        // Delete all questions
        // belonging to this test

        await Question.deleteMany({

            test: id

        });


        // Delete the test

        await Test.findByIdAndDelete(id);


        res.json({

            message:
                "Test deleted successfully"

        });


    } catch (error) {

        res.status(500).json({

            message:
                "Server error",

            error: error.message

        });

    }

};


// =====================================
// EXPORT
// =====================================

module.exports = {

    createTest,

    getAllTests,

    getTestById,

    updateTest,

    deleteTest

};