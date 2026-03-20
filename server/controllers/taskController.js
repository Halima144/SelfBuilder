const Task = require("../models/Task");
const Progress = require("../models/Progress");
const Challenge = require("../models/Challenge");
const { checkAndAwardBadges, checkComeback } = require("../config/badgeEngine");

exports.getProgress = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge)
      return res.status(404).json({ message: "Challenge not found" });

    let userProgress = await Progress.findOne({ userId, challengeId });

    if (!userProgress) {
      const allTasks = await Task.find({ challengeId }).sort({ day: 1 });
      const dailyProgress = allTasks.map((t) => ({
        day: t.day,
        completed: false,
        completedAt: null,
      }));
      userProgress = await Progress.create({
        userId, challengeId, dailyProgress,
        currentStreak: 0, longestStreak: 0,
      });
    }

    // Miss check + streak reset + comeback badge
    if (userProgress.lastCompletedDate && !userProgress.isCompleted) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const lastDate = new Date(userProgress.lastCompletedDate); lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        userProgress.dailyProgress = userProgress.dailyProgress.map((p) => ({
          ...p, completed: false, completedAt: null,
        }));
        userProgress.currentDay = 1;
        userProgress.completedDays = 0;
        userProgress.lastCompletedDate = null;
        userProgress.isCompleted = false;
        userProgress.currentStreak = 0;
        await userProgress.save();

        // Comeback badge
        await checkComeback(userId);
      }
    }

    const todayTask = await Task.findOne({ challengeId, day: userProgress.currentDay });

    return res.json({
      dailyProgress: userProgress.dailyProgress,
      todayTask: todayTask?.taskText || "",
      todayDay: userProgress.currentDay,
      completedDays: userProgress.completedDays,
      isCompleted: userProgress.isCompleted,
      currentStreak: userProgress.currentStreak,
      longestStreak: userProgress.longestStreak,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeTask = async (req, res) => {
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

    if (userProgress.lastCompletedDate) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const lastDate = new Date(userProgress.lastCompletedDate); lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return res.status(400).json({
          message: "You have already completed today's task! Come back tomorrow.",
        });
      }
    }

    userProgress.dailyProgress = userProgress.dailyProgress.map((p) =>
      p.day === currentDay
        ? { ...p, completed: true, completedAt: new Date() }
        : p
    );

    userProgress.lastCompletedDate = new Date();
    userProgress.completedDays += 1;
    userProgress.currentDay += 1;
    userProgress.currentStreak += 1;

    if (userProgress.currentStreak > userProgress.longestStreak) {
      userProgress.longestStreak = userProgress.currentStreak;
    }

    if (userProgress.completedDays >= challenge.duration) {
      userProgress.isCompleted = true;
      userProgress.currentDay = challenge.duration;
    }

    await userProgress.save();

    // Badge check
    const newBadges = await checkAndAwardBadges(userId, userProgress);

    return res.json({
      message: "Task completed!",
      completedDays: userProgress.completedDays,
      isCompleted: userProgress.isCompleted,
      currentStreak: userProgress.currentStreak,
      longestStreak: userProgress.longestStreak,
      newBadges, // frontend pe popup dikhao
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};