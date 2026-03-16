const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  challengeType: { type: String, required: true },
  day: { type: Number, required: true },
  taskText: { type: String, required: true },
  challengeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Challenge",
    required: true  // ✅ required karo
  },
});

// ✅ Unique index — ek challenge mein ek hi Day 1 ho sakta
taskSchema.index({ challengeId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model("Task", taskSchema);