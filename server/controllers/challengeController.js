const Task = require("../models/Task");
const tasks = require("../config/challengeTasks");

const createDailyTasksForUser = async (userId, challenge) => {
  const taskList = tasks[challenge.challengeType]; // pick category
  if (!taskList) return;

  for (let i = 0; i < challenge.duration; i++) {
    await Task.create({
      userId,
      challengeId: challenge._id,
      day: i + 1,
      category: challenge.challengeType,
      taskText: taskList[i % taskList.length], // rotate tasks if duration > list
    });
  }
};