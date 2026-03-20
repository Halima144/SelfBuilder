const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Badge = require("../models/Badge");
const { BADGES } = require("../config/badgeEngine");

// GET /api/badges/my — apne badges dekho
router.get("/my", auth, async (req, res) => {
  try {
    const userBadges = await Badge.find({ userId: req.user.id }).sort({ awardedAt: -1 });

    // Badge keys ko full info ke saath return karo
    const badgeValues = Object.values(BADGES);
    const result = userBadges.map((b) => {
      const info = badgeValues.find((bv) => bv.key === b.badge);
      return {
        key: b.badge,
        emoji: info?.emoji || "🏅",
        label: info?.label || b.badge,
        desc: info?.desc || "",
        awardedAt: b.awardedAt,
      };
    });

    res.json({ badges: result });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;