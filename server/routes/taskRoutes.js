const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getProgress, completeTask } = require("../controllers/taskController");

router.get("/:challengeId", auth, getProgress);
router.post("/:challengeId/complete", auth, completeTask);

module.exports = router;
