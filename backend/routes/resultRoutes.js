const express = require("express");

const {
    submitTest,
    getMyResults,
    getAllResults
} = require("../controllers/resultController");

const protect = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();


// Student submits test
router.post("/submit", protect, submitTest);


// Student views their own results
router.get("/my-results", protect, getMyResults);


// Admin views all student results
router.get("/all", protect, adminOnly, getAllResults);


module.exports = router;