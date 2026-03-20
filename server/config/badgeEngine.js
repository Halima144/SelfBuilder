const Badge = require("../models/Badge");

// Sab possible badges define karo
const BADGES = {
  FIRST_COMPLETE:   { key: "first_complete",   emoji: "⚡", label: "First Complete",   desc: "Complete your first task" },
  STREAK_3:         { key: "streak_3",          emoji: "🔥", label: "3-Day Streak",     desc: "3 consecutive days" },
  STREAK_7:         { key: "streak_7",          emoji: "🔥", label: "7-Day Streak",     desc: "7 consecutive days" },
  STREAK_30:        { key: "streak_30",         emoji: "💎", label: "30-Day Streak",    desc: "30 consecutive days" },
  CHALLENGE_DONE:   { key: "challenge_done",    emoji: "🏆", label: "Challenge Done",   desc: "Complete a full challenge" },
  COMEBACK:         { key: "comeback",          emoji: "💪", label: "Comeback Kid",     desc: "Restart after a reset" },
};

// Badge award karo — duplicate silently ignore hoga
const awardBadge = async (userId, badgeKey) => {
  try {
    await Badge.create({ userId, badge: badgeKey });
    return true;
  } catch {
    return false; // already exists — ignore
  }
};

// Task complete hone ke baad check karo
const checkAndAwardBadges = async (userId, userProgress) => {
  const awarded = [];

  // First task complete
  if (userProgress.completedDays === 1) {
    const ok = await awardBadge(userId, BADGES.FIRST_COMPLETE.key);
    if (ok) awarded.push(BADGES.FIRST_COMPLETE);
  }

  // Streak badges
  if (userProgress.currentStreak === 3) {
    const ok = await awardBadge(userId, BADGES.STREAK_3.key);
    if (ok) awarded.push(BADGES.STREAK_3);
  }
  if (userProgress.currentStreak === 7) {
    const ok = await awardBadge(userId, BADGES.STREAK_7.key);
    if (ok) awarded.push(BADGES.STREAK_7);
  }
  if (userProgress.currentStreak === 30) {
    const ok = await awardBadge(userId, BADGES.STREAK_30.key);
    if (ok) awarded.push(BADGES.STREAK_30);
  }

  // Challenge fully completed
  if (userProgress.isCompleted) {
    const ok = await awardBadge(userId, BADGES.CHALLENGE_DONE.key);
    if (ok) awarded.push(BADGES.CHALLENGE_DONE);
  }

  return awarded; // frontend ko batao kaunse naye badges mile
};

// Reset ke baad comeback badge
const checkComeback = async (userId) => {
  return await awardBadge(userId, BADGES.COMEBACK.key);
};

module.exports = { checkAndAwardBadges, checkComeback, BADGES };