import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import api from "../../../api";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface Challenge {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  image: string;
}

interface DayProgress {
  day: number;
  completed: boolean;
  completedAt?: string;
}

interface BadgeInfo {
  key: string;
  emoji: string;
  label: string;
  desc: string;
}

// ─────────────────────────────────────────────────
// Mini Bar Graph — no external package
// Last 7 days ki activity dikhata hai
// ─────────────────────────────────────────────────
const WeeklyGraph = ({ dailyProgress }: { dailyProgress: DayProgress[] }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Last 7 completed days nikalo
  const completed = dailyProgress.filter((p) => p.completed && p.completedAt);
  const last7 = completed.slice(-7);

  // Har bar ki height calculate karo (relative)
  // Yahan hum sirf completed/not completed dikhate hain per day slot
  // Graph width
  const graphWidth = SCREEN_WIDTH - 32 - 40; // padding minus
  const barWidth = (graphWidth / 7) * 0.5;
  const barGap = (graphWidth / 7) * 0.5;
  const maxBarHeight = 60;

  // Last 7 days ke liye day labels + completion status
  const today = new Date();
  const slots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);

    const wasCompleted = completed.some((p) => {
      if (!p.completedAt) return false;
      const pd = new Date(p.completedAt);
      pd.setHours(0, 0, 0, 0);
      return pd.getTime() === d.getTime();
    });

    return {
      label: days[d.getDay() === 0 ? 6 : d.getDay() - 1],
      done: wasCompleted,
      isToday: i === 6,
    };
  });

  return (
    <View style={graphStyles.container}>
      <Text style={graphStyles.title}>📊 Weekly Activity</Text>
      <View style={graphStyles.barsRow}>
        {slots.map((slot, idx) => (
          <View key={idx} style={graphStyles.barCol}>
            {/* Bar */}
            <View style={graphStyles.barTrack}>
              <View
                style={[
                  graphStyles.bar,
                  {
                    height: slot.done ? maxBarHeight : 10,
                    backgroundColor: slot.done
                      ? slot.isToday
                        ? "#7c4daa"
                        : "#ab73d1"
                      : "#ede7f6",
                  },
                ]}
              />
            </View>
            {/* Dot for today */}
            {slot.isToday && (
              <View style={graphStyles.todayDot} />
            )}
            {/* Day label */}
            <Text
              style={[
                graphStyles.dayLabel,
                slot.isToday && graphStyles.dayLabelToday,
              ]}
            >
              {slot.label}
            </Text>
          </View>
        ))}
      </View>
      {/* Legend */}
      <View style={graphStyles.legend}>
        <View style={graphStyles.legendItem}>
          <View style={[graphStyles.legendDot, { backgroundColor: "#ab73d1" }]} />
          <Text style={graphStyles.legendText}>Completed</Text>
        </View>
        <View style={graphStyles.legendItem}>
          <View style={[graphStyles.legendDot, { backgroundColor: "#ede7f6" }]} />
          <Text style={graphStyles.legendText}>Missed</Text>
        </View>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────
const ChallengeDetail = () => {
  const route = useRoute<any>();
  const { challenge } = route.params as { challenge: Challenge };

  const [loading, setLoading] = useState(true);
  const [dailyProgress, setDailyProgress] = useState<DayProgress[]>([]);
  const [todayTask, setTodayTask] = useState("");
  const [todayDay, setTodayDay] = useState(1);
  const [completedDays, setCompletedDays] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [wasReset, setWasReset] = useState(false);
  const [prevCompleted, setPrevCompleted] = useState(0);

  // Streak
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Badges
  const [newBadges, setNewBadges] = useState<BadgeInfo[]>([]);
  const [badgeModal, setBadgeModal] = useState(false);

  const fetchTasks = async (prev = 0) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/tasks/${challenge._id}`);
      const data = res.data;

      if (prev > 0 && data.completedDays === 0) setWasReset(true);

      setDailyProgress(data.dailyProgress);
      setTodayTask(data.todayTask || "");
      setTodayDay(data.todayDay);
      setCompletedDays(data.completedDays);
      setIsCompleted(data.isCompleted);
      setPrevCompleted(data.completedDays);
      setCurrentStreak(data.currentStreak || 0);
      setLongestStreak(data.longestStreak || 0);
    } catch {
      Alert.alert("Error", "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleComplete = async () => {
    try {
      setSubmitting(true);
      const res = await api.post(`/api/tasks/${challenge._id}/complete`);

      // Naye badges mile to modal dikhao
      if (res.data.newBadges?.length > 0) {
        setNewBadges(res.data.newBadges);
        setBadgeModal(true);
      }

      setWasReset(false);
      fetchTasks(prevCompleted);
    } catch (err: any) {
      Alert.alert("Notice", err.response?.data?.message || "Failed to complete task");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ab73d1" />
      </View>
    );
  }

  const progressPercent = Math.round((completedDays / challenge.duration) * 100);
  const todayDone = dailyProgress.find((p) => p.day === todayDay)?.completed;

  return (
    <>
      <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

        {/* ── Hero ───────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>
              {challenge.category.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.heroTitle}>{challenge.title}</Text>
          <Text style={styles.heroDesc}>{challenge.description}</Text>
        </View>

        {/* ── Progress Card ──────────────────────── */}
        <View style={styles.progressCard}>
          {/* Day + Percent */}
          <View style={styles.progressHeader}>
            <Text style={styles.progressDayText}>
              Day {completedDays} of {challenge.duration}
            </Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>

          {/* Bar */}
          <View style={styles.barTrackOuter}>
            <View style={[styles.barFill, { width: `${progressPercent}%` }]} />
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{completedDays}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{challenge.duration - completedDays}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{challenge.duration}</Text>
              <Text style={styles.statLabel}>Total Days</Text>
            </View>
          </View>
        </View>

        {/* ── Body ───────────────────────────────── */}
        <View style={styles.body}>

          {/* ── Streak Card ────────────────────────── */}
          <View style={styles.streakCard}>
            <Text style={styles.streakHeading}>🔥 STREAK</Text>
            <View style={styles.streakRow}>
              <View style={styles.streakItem}>
                <Text style={styles.streakNum}>{currentStreak}</Text>
                <Text style={styles.streakLabel}>Current</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakItem}>
                <Text style={styles.streakNum}>{longestStreak}</Text>
                <Text style={styles.streakLabel}>Longest</Text>
              </View>
            </View>
            {/* Streak message */}
            {currentStreak >= 3 && (
              <View style={styles.streakBanner}>
                <Text style={styles.streakBannerText}>
                  {currentStreak >= 7
                    ? "🚀 You're on fire! Keep it up!"
                    : "💪 Great streak! Don't break it!"}
                </Text>
              </View>
            )}
          </View>

          {/* ── Weekly Graph ───────────────────────── */}
          <WeeklyGraph dailyProgress={dailyProgress} />

          {/* Reset Banner */}
          {wasReset && (
            <View style={styles.resetBanner}>
              <Text style={styles.resetText}>
                You missed a day. Your progress has been reset. Start from Day 1.
              </Text>
            </View>
          )}

          {/* ── Challenge Completed ────────────────── */}
          {isCompleted ? (
            <View style={styles.completedCard}>
              <Text style={styles.completedEmoji}>🏆</Text>
              <Text style={styles.completedTitle}>Challenge Complete!</Text>
              <Text style={styles.completedSub}>
                You successfully completed all {challenge.duration} days.
              </Text>
            </View>
          ) : (
            <>
              {/* ── Task Card ──────────────────────── */}
              <View style={styles.taskCard}>
                {/* Day Pill */}
                <View style={styles.dayPill}>
                  <Text style={styles.dayPillText}>DAY {todayDay}</Text>
                </View>

                <Text style={styles.taskHeading}>Today's Task</Text>
                <Text style={styles.taskText}>
                  {todayTask || "No task available"}
                </Text>

                <View style={styles.divider} />

                {/* Button */}
                <TouchableOpacity
                  onPress={handleComplete}
                  disabled={submitting || todayDone}
                  style={[
                    styles.completeBtn,
                    (submitting || todayDone) && styles.completeBtnDisabled,
                  ]}
                  activeOpacity={0.85}
                >
                  <Text style={styles.completeBtnText}>
                    {submitting ? "Saving..." : todayDone ? "✓ Done Today" : "Mark as Done"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Done Today Banner */}
              {todayDone && (
                <View style={styles.doneBanner}>
                  <Text style={styles.doneBannerText}>
                    ✅ You have completed today's task. See you tomorrow!
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* ── Badge Modal ────────────────────────────── */}
      <Modal visible={badgeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🎉</Text>
            <Text style={styles.modalTitle}>Badge Earned!</Text>
            <Text style={styles.modalSub}>You unlocked something special</Text>

            {newBadges.map((b) => (
              <View key={b.key} style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                <Text style={styles.badgeLabel}>{b.label}</Text>
                <Text style={styles.badgeDesc}>{b.desc}</Text>
              </View>
            ))}

            <TouchableOpacity
              onPress={() => setBadgeModal(false)}
              style={styles.modalBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.modalBtnText}>Awesome! 🎊</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

// ─────────────────────────────────────────────────
// Graph Styles
// ─────────────────────────────────────────────────
const graphStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ede7f6",
    shadowColor: "#9b5fc4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9b5fc4",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 80,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  barTrack: {
    width: "60%",
    height: 60,
    justifyContent: "flex-end",
    borderRadius: 6,
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderRadius: 6,
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#7c4daa",
    marginTop: 3,
  },
  dayLabel: {
    fontSize: 10,
    color: "#b0a0c0",
    fontWeight: "600",
    marginTop: 4,
  },
  dayLabelToday: {
    color: "#7c4daa",
    fontWeight: "800",
  },
  legend: {
    flexDirection: "row",
    marginTop: 14,
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "#b0a0c0",
    fontWeight: "500",
  },
});

// ─────────────────────────────────────────────────
// Main Styles
// ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f3fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f3fa" },

  // Hero
  hero: {
    backgroundColor: "#ab73d1",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  categoryPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  categoryText: { color: "#fff", fontSize: 10, fontWeight: "800", letterSpacing: 2 },
  heroTitle: { color: "#fff", fontSize: 26, fontWeight: "800", lineHeight: 32, marginBottom: 6 },
  heroDesc: { color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 20 },

  // Progress Card
  progressCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#9b5fc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressDayText: { fontSize: 13, color: "#b0a0c0" },
  progressPercent: { fontSize: 13, fontWeight: "800", color: "#ab73d1" },
  barTrackOuter: { height: 6, backgroundColor: "#f0eaf7", borderRadius: 10, overflow: "hidden" },
  barFill: { height: 6, backgroundColor: "#ab73d1", borderRadius: 10 },
  statsRow: {
    flexDirection: "row",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3eef8",
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 20, fontWeight: "800", color: "#2d1b4e" },
  statLabel: { fontSize: 11, color: "#b0a0c0", marginTop: 2, letterSpacing: 0.5 },
  statDivider: { width: 1, backgroundColor: "#f0eaf7" },

  // Body
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },

  // Streak Card
  streakCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ede7f6",
    shadowColor: "#9b5fc4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  streakHeading: {
    fontSize: 13, fontWeight: "700", color: "#9b5fc4",
    letterSpacing: 1, textTransform: "uppercase", marginBottom: 14,
  },
  streakRow: { flexDirection: "row", justifyContent: "space-around" },
  streakItem: { alignItems: "center" },
  streakNum: { fontSize: 32, fontWeight: "800", color: "#2d1b4e" },
  streakLabel: { fontSize: 11, color: "#b0a0c0", marginTop: 2, letterSpacing: 0.5 },
  streakDivider: { width: 1, backgroundColor: "#f0eaf7" },
  streakBanner: {
    marginTop: 14,
    backgroundColor: "#faf5ff",
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#ab73d1",
  },
  streakBannerText: { fontSize: 12, color: "#7c4daa", fontWeight: "600" },

  // Reset Banner
  resetBanner: {
    backgroundColor: "#fff8f0",
    borderLeftWidth: 3,
    borderLeftColor: "#e8a87c",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  resetText: { fontSize: 13, color: "#b36a2e", lineHeight: 20 },

  // Completed
  completedCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c3e6cb",
  },
  completedEmoji: { fontSize: 48, marginBottom: 12 },
  completedTitle: { fontSize: 20, fontWeight: "800", color: "#2d1b4e", marginBottom: 6 },
  completedSub: { fontSize: 13, color: "#b0a0c0", textAlign: "center", lineHeight: 20 },

  // Task Card
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#ede7f6",
    marginBottom: 12,
    shadowColor: "#9b5fc4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  dayPill: {
    alignSelf: "flex-start",
    backgroundColor: "#f3eaf9",
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  dayPillText: { fontSize: 10, fontWeight: "800", color: "#9b5fc4", letterSpacing: 2 },
  taskHeading: {
    fontSize: 11, fontWeight: "700", color: "#c4aad9",
    letterSpacing: 2, textTransform: "uppercase", marginBottom: 8,
  },
  taskText: { fontSize: 17, fontWeight: "600", color: "#2d1b4e", lineHeight: 26 },
  divider: { height: 1, backgroundColor: "#f5f0fb", marginVertical: 20 },
  completeBtn: {
    backgroundColor: "#ab73d1",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  completeBtnDisabled: { backgroundColor: "#d4b8e8" },
  completeBtnText: { color: "#fff", fontSize: 15, fontWeight: "700", letterSpacing: 0.5 },

  // Done Banner
  doneBanner: {
    backgroundColor: "#f0faf4",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#c3e6cb",
  },
  doneBannerText: { fontSize: 13, color: "#3a7d52", textAlign: "center", lineHeight: 20 },

  // Badge Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 32,
    marginHorizontal: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalEmoji: { fontSize: 48, marginBottom: 8 },
  modalTitle: { fontSize: 22, fontWeight: "800", color: "#2d1b4e", marginBottom: 4 },
  modalSub: { fontSize: 13, color: "#b0a0c0", marginBottom: 20 },
  badgeItem: { alignItems: "center", marginVertical: 8 },
  badgeEmoji: { fontSize: 40, marginBottom: 4 },
  badgeLabel: { fontSize: 16, fontWeight: "700", color: "#2d1b4e" },
  badgeDesc: { fontSize: 12, color: "#b0a0c0", marginTop: 2 },
  modalBtn: {
    marginTop: 20,
    backgroundColor: "#ab73d1",
    borderRadius: 14,
    paddingHorizontal: 36,
    paddingVertical: 14,
  },
  modalBtnText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});

export default ChallengeDetail;
