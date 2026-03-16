const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const challengeRoutes = require("./routes/challengeRoutes");
const progressRoutes = require("./routes/progressRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/challenges/progress", progressRoutes);
app.use("/api/tasks", taskRoutes);

// Test server
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});