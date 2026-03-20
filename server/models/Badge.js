const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  badge: { type: String, required: true },       // badge ka naam
  awardedAt: { type: Date, default: Date.now },
});

// ek user ko ek hi baar same badge mile
badgeSchema.index({ userId: 1, badge: 1 }, { unique: true });

module.exports = mongoose.model("Badge", badgeSchema);