const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


// =====================================
// IMPORT ROUTES
// =====================================

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const questionRoutes = require("./routes/questionRoutes");
const resultRoutes = require("./routes/resultRoutes");


// =====================================
// CREATE EXPRESS APP
// =====================================

const app = express();


// =====================================
// SERVER INFORMATION
// =====================================

console.log("=================================");
console.log("ONLINE EXAMINATION SYSTEM");
console.log("SERVER FILE LOADED");
console.log("FILE:", __filename);
console.log("=================================");


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());


// =====================================
// HOME ROUTE
// =====================================

app.get("/", (req, res) => {
    res.json({
        message: "Online Examination System API is running"
    });
});


// =====================================
// API ROUTES
// =====================================

// Authentication
app.use("/api/auth", authRoutes);

// Tests
app.use("/api/tests", testRoutes);

// Questions
app.use("/api/questions", questionRoutes);

// Results
app.use("/api/results", resultRoutes);


console.log("All API routes loaded");


// =====================================
// MONGODB CONNECTION
// =====================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB connected");

        console.log(
            "Database name:",
            mongoose.connection.name
        );


        // =====================================
        // START SERVER
        // =====================================

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        });

    })
    .catch((error) => {

        console.log(
            "MongoDB connection error:",
            error.message
        );

    });