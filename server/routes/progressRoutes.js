const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");
const Challenge = require("../models/Challenge");
const auth = require("../middleware/authMiddleware");
const tasks = require("../config/challengeTasks");

// GET: progress + today's task for a challenge
router.get("/:challengeId", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const progress = await Progress.find({ userId, challengeId }).sort("day");
    const completedDays = progress.filter((p) => p.completed).length;
    const todayDay = completedDays + 1;

    let todayTask = "";
    if (tasks[challenge.challengeType]) {
      const taskList = tasks[challenge.challengeType];
      if (todayDay <= challenge.duration) {
        todayTask = taskList[(todayDay - 1) % taskList.length];
      }
    }

    res.status(200).json({
      progress,
      completedDays,
      todayDay,
      todayTask,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST: mark today's task as completed
router.post("/:challengeId/complete", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.params;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ message: "Challenge not found" });

    const progress = await Progress.find({ userId, challengeId }).sort("day");
    const completedDays = progress.filter((p) => p.completed).length;
    const todayDay = completedDays + 1;

    // Check if challenge already completed
    if (todayDay > challenge.duration)
      return res.status(400).json({ message: "Challenge already completed" });

    const todayProgress = await Progress.findOne({ userId, challengeId, day: todayDay });
    if (!todayProgress)
      return res.status(404).json({ message: "Today's progress not found" });

    if (todayProgress.completed)
      return res.status(400).json({ message: "Today's task already completed" });

    todayProgress.completed = true;
    await todayProgress.save();

    res.status(200).json({ message: "Today's task completed", todayDay });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;