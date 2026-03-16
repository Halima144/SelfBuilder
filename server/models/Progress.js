const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    currentDay: { type: Number, default: 1 },
    completedDays: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    lastCompletedDate: { type: Date, default: null },
    dailyProgress: [
      {
        day: Number,
        completed: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
      },
    ],
  },
  { timestamps: true }
);

// Ek user ka ek challenge mein sirf ek record
progressSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);