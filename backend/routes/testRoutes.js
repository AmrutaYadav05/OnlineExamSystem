const express = require("express");

const {
    createTest,
    getTestById,
    getAllTests,
    updateTest,
    deleteTest
} = require("../controllers/testController");

const protect =
    require("../middleware/authMiddleware");

const {
    adminOnly
} = require("../middleware/roleMiddleware");

const router = express.Router();


// =====================================
// CREATE TEST
// =====================================

router.post(
    "/",
    protect,
    adminOnly,
    createTest
);


// =====================================
// GET ALL TESTS
// =====================================

router.get(
    "/",
    protect,
    getAllTests
);


// =====================================
// UPDATE TEST
// =====================================

router.put(
    "/:id",
    protect,
    adminOnly,
    updateTest
);


// =====================================
// DELETE TEST
// =====================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteTest
);


// =====================================
// GET TEST BY ID
// =====================================

router.get(
    "/:id",
    protect,
    getTestById
);


module.exports = router;