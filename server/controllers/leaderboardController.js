const Progress = require("../models/Progress");
const User = require("../models/User");
const Challenge = require("../models/Challenge");

exports.getLeaderboard = async (req, res) => {
  try {
    const { filter = "alltime", category } = req.query;

    // Weekly date range
    let dateMatch = {};
    if (filter === "weekly") {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      dateMatch = { updatedAt: { $gte: startOfWeek } };
    }

    // Category filter — pehle challengeIds nikalo us category ke
    let challengeMatch = {};
    if (category && category !== "all") {
      const categoryChallenges = await Challenge.find({ category }).select("_id");
      const ids = categoryChallenges.map((c) => c._id);
      challengeMatch = { challengeId: { $in: ids } };
    }

    const leaderboard = await Progress.aggregate([
      { $match: { ...dateMatch, ...challengeMatch } },
      {
        $group: {
          _id: "$userId",
          totalCompleted: { $sum: "$completedDays" },
          challengesJoined: { $sum: 1 },
          bestStreak: { $max: "$longestStreak" },  // streak bhi leaderboard mein
        },
      },
      { $sort: { totalCompleted: -1 } },
      { $limit: 20 },
    ]);

    const populated = await Promise.all(
      leaderboard.map(async (entry, index) => {
        const user = await User.findById(entry._id).select("name email");
        return {
          rank: index + 1,
          userId: entry._id,
          name: user?.name || "Unknown",
          totalCompleted: entry.totalCompleted,
          challengesJoined: entry.challengesJoined,
          bestStreak: entry.bestStreak || 0,
        };
      })
    );

    const currentUserRank = populated.findIndex(
      (e) => e.userId.toString() === req.user.id.toString()
    );

    res.json({
      leaderboard: populated,
      currentUserRank: currentUserRank + 1,
      currentUserId: req.user.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};