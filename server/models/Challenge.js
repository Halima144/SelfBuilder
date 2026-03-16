const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  category: {
    type: String,
    enum: ["Productivity", "Mindset", "Health", "Career"],
    required: true
  },
// NEW FIELD
  challengeType: {
    type: String,
    enum: ["routine", "fitness", "study", "career"],
    required: true
  },

  duration: {
    type: Number
  },

  image: {
    type: String
  },

  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("Challenge", ChallengeSchema);