const express = require("express");
const router = express.Router();
const Challenge = require("../models/Challenge");
const Progress = require("../models/Progress");
const auth = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
// Get all challenges
router.get("/", async (req, res) => {
  try {
    const challenges = await Challenge.find();
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Enroll in a challenge
router.post("/enroll/:id", auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const userId = req.user.id;

  if (challenge.participants.find(p => p.toString() === userId)) {
  return res.status(400).json({ message: "Already enrolled" });
}

    challenge.participants.push(userId);
    await challenge.save();


    res.json({ message: "Enrolled successfully " });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
// Get user challenges (My Challenges screen)
router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user.id;
const challenges = await Challenge.find({ participants: new mongoose.Types.ObjectId(userId) });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Challenge detail + today's task (kept as you had it)
router.get("/detail/:challengeId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const progress = await Progress.find({ userId, challengeId }).sort("day");
    const completedDays = progress.filter((p) => p.completed).length;
    const todayDay = completedDays + 1;

    const tasks = require("../config/challengeTasks");
    let todayTask = "";
    if (tasks[challenge.challengeType]) {
      const taskList = tasks[challenge.challengeType];
      if (todayDay <= challenge.duration) {
        todayTask = taskList[(todayDay - 1) % taskList.length];
      }
    }

    res.json({
      challenge,
      progress,
      completedDays,
      todayDay,
      todayTask,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;