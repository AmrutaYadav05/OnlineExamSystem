const express = require("express");

const {
    createQuestion,
    getQuestionsByTest,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questionController");

const protect =
    require("../middleware/authMiddleware");

const { adminOnly } =
    require("../middleware/roleMiddleware");

const router = express.Router();


// Create question
router.post(
    "/",
    protect,
    adminOnly,
    createQuestion
);


// Get all questions of a test
router.get(
    "/test/:testId",
    protect,
    adminOnly,
    getQuestionsByTest
);


// Update question
router.put(
    "/:id",
    protect,
    adminOnly,
    updateQuestion
);


// Delete question
router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteQuestion
);


module.exports = router;