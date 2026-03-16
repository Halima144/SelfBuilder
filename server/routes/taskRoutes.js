const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Progress = require("../models/Progress");
const Challenge = require("../models/Challenge");
const auth = require("../middleware/authMiddleware"); // apna sahi path lagao

// ─────────────────────────────────────────────────
// GET /api/tasks/:challengeId
// User ka progress fetch karo + aaj ka task
// ─────────────────────────────────────────────────
router.get("/:challengeId", auth, async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    let userProgress = await Progress.findOne({ userId, challengeId });

    // ── Pehli baar enroll ──────────────────────────
    if (!userProgress) {
      const allTasks = await Task.find({ challengeId }).sort({ day: 1 });
      const dailyProgress = allTasks.map((t) => ({
        day: t.day,
        completed: false,
        completedAt: null,
      }));

      userProgress = await Progress.create({
        userId,
        challengeId,
        dailyProgress,
      });
    }

    // ── Miss Check ─────────────────────────────────
    // Agar last complete ke baad 1 se zyada din gap → reset
    if (userProgress.lastCompletedDate && !userProgress.isCompleted) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastDate = new Date(userProgress.lastCompletedDate);
      lastDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today - lastDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > 1) {
        // Reset everything
        userProgress.dailyProgress = userProgress.dailyProgress.map((p) => ({
          ...p,
          completed: false,
          completedAt: null,
        }));
        userProgress.currentDay = 1;
        userProgress.completedDays = 0;
        userProgress.lastCompletedDate = null;
        userProgress.isCompleted = false;
        await userProgress.save();
      }
    }

    // ── Aaj ka task ────────────────────────────────
    const todayTask = await Task.findOne({
      challengeId,
      day: userProgress.currentDay,
    });

    return res.json({
      dailyProgress: userProgress.dailyProgress,
      todayTask: todayTask?.taskText || "",
      todayDay: userProgress.currentDay,
      completedDays: userProgress.completedDays,
      isCompleted: userProgress.isCompleted,
      wasReset: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────
// POST /api/tasks/:challengeId/complete
// Aaj ka task complete karo
// ─────────────────────────────────────────────────
router.post("/:challengeId/complete", auth, async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    const userProgress = await Progress.findOne({ userId, challengeId });
    if (!userProgress)
      return res.status(404).json({ message: "Progress not found" });

    if (userProgress.isCompleted)
      return res.status(400).json({ message: "Challenge already completed!" });

    const currentDay = userProgress.currentDay;

    // ── Same din dobara complete check ─────────────
    if (userProgress.lastCompletedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastDate = new Date(userProgress.lastCompletedDate);
      lastDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (today - lastDate) / (1000 * 60 * 60 * 24)
      );

      // Aaj already complete kar chuka hai
      if (diffDays === 0) {
        return res.status(400).json({
          message: "You have already completed today's task! Come back tomorrow.",
        });
      }
    }

    // ── Task mark as done ──────────────────────────
    userProgress.dailyProgress = userProgress.dailyProgress.map((p) =>
      p.day === currentDay
        ? { ...p, completed: true, completedAt: new Date() }
        : p
    );

    userProgress.lastCompletedDate = new Date();
    userProgress.completedDays += 1;
    userProgress.currentDay += 1;

    // ── Full challenge complete check ──────────────
    if (userProgress.completedDays >= challenge.duration) {
      userProgress.isCompleted = true;
      userProgress.currentDay = challenge.duration; // overflow rokne ke liye
    }

    await userProgress.save();

    return res.json({
      message: "Task completed!",
      completedDays: userProgress.completedDays,
      isCompleted: userProgress.isCompleted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;