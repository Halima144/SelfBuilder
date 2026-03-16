const mongoose = require("mongoose");

const userTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
  day: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
});

module.exports = mongoose.model("UserTask", userTaskSchema);