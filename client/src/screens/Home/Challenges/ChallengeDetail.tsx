import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import api from "../../../api";

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
      await api.post(`/api/tasks/${challenge._id}/complete`);
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
      <View className="flex-1 justify-center items-center bg-[#f5f3fa]">
        <ActivityIndicator size="large" color="#ab73d1" />
      </View>
    );
  }

  const progressPercent = Math.round((completedDays / challenge.duration) * 100);
  const todayDone = dailyProgress.find((p) => p.day === todayDay)?.completed;

  return (
    <ScrollView
      className="flex-1 bg-[#f5f3fa]"
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ───────────────────────────────── */}
      <View
        className="bg-[#ab73d1] px-6 pt-14 pb-10"
        style={styles.heroRadius}
      >
        <View className="self-start bg-white/20 rounded-full px-3 py-1 mb-3">
          <Text className="text-white text-[10px] font-bold tracking-widest">
            {challenge.category.toUpperCase()}
          </Text>
        </View>
        <Text className="text-white text-[26px] font-bold leading-8 mb-1">
          {challenge.title}
        </Text>
        <Text className="text-white/75 text-sm leading-5">
          {challenge.description}
        </Text>
      </View>

      {/* ── Progress Card ──────────────────────── */}
      <View
        className="bg-white mx-5 rounded-2xl p-5"
        style={styles.progressCard}
      >
        {/* Day + Percent */}
        <View className="flex-row justify-between mb-2">
          <Text className="text-[13px] text-gray-400">
            Day {completedDays} of {challenge.duration}
          </Text>
          <Text className="text-[13px] font-bold text-[#ab73d1]">
            {progressPercent}%
          </Text>
        </View>

        {/* Progress Bar — inline style for dynamic width only */}
        <View className="h-1.5 bg-[#f0eaf7] rounded-full overflow-hidden">
          <View
            className="h-1.5 bg-[#ab73d1] rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>

        {/* Stats */}
        <View
          className="flex-row mt-4 pt-4"
          style={styles.statsBorder}
        >
          <View className="flex-1 items-center">
            <Text className="text-[20px] font-bold text-[#2d1b4e]">
              {completedDays}
            </Text>
            <Text className="text-[11px] text-[#b0a0c0] mt-0.5 tracking-wide">
              Completed
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View className="flex-1 items-center">
            <Text className="text-[20px] font-bold text-[#2d1b4e]">
              {challenge.duration - completedDays}
            </Text>
            <Text className="text-[11px] text-[#b0a0c0] mt-0.5 tracking-wide">
              Remaining
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View className="flex-1 items-center">
            <Text className="text-[20px] font-bold text-[#2d1b4e]">
              {challenge.duration}
            </Text>
            <Text className="text-[11px] text-[#b0a0c0] mt-0.5 tracking-wide">
              Total Days
            </Text>
          </View>
        </View>
      </View>

      {/* ── Body ───────────────────────────────── */}
      <View className="px-5 pt-5 pb-10">

        {/* Reset Banner */}
        {wasReset && (
          <View style={styles.resetBanner} className="rounded-md p-3 mb-4">
            <Text className="text-[13px] text-[#b36a2e] leading-5">
              You missed a day. Your progress has been reset. Start from Day 1.
            </Text>
          </View>
        )}

        {/* Challenge Completed */}
        {isCompleted ? (
          <View className="bg-white rounded-2xl p-7 items-center border border-[#c3e6cb]">
            <Text className="text-[20px] font-bold text-[#2d1b4e] mb-2">
              Challenge Complete
            </Text>
            <Text className="text-sm text-gray-400 text-center leading-5">
              You have successfully completed all {challenge.duration} days.
            </Text>
          </View>
        ) : (
          <>
            {/* Task Card */}
            <View className="bg-white rounded-[20px] p-6 border border-[#ede7f6] mb-3">

              {/* Day Pill */}
              <View className="self-start bg-[#f3eaf9] rounded-full px-3 py-1 mb-4">
                <Text className="text-[10px] font-bold text-[#9b5fc4] tracking-widest">
                  DAY {todayDay}
                </Text>
              </View>

              {/* Task */}
              <Text className="text-[11px] font-semibold text-[#c4aad9] tracking-widest uppercase mb-2">
                Today's Task
              </Text>
              <Text className="text-[17px] font-semibold text-[#2d1b4e] leading-6">
                {todayTask || "No task available"}
              </Text>

              {/* Divider */}
              <View className="h-px bg-[#f5f0fb] my-5" />

              {/* Button */}
              <TouchableOpacity
                onPress={handleComplete}
                disabled={submitting || todayDone}
                className={`rounded-xl py-[14px] items-center ${
                  submitting || todayDone ? "bg-[#d4b8e8]" : "bg-[#ab73d1]"
                }`}
                activeOpacity={0.85}
              >
                <Text className="text-white text-[15px] font-semibold tracking-wide">
                  {submitting ? "Saving..." : "Mark as Done"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Done Today Banner */}
            {todayDone && (
              <View className="bg-[#f0faf4] rounded-xl p-4 border border-[#c3e6cb]">
                <Text className="text-[14px] text-[#3a7d52] text-center leading-5">
                  You have completed today's task. See you tomorrow.
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

// Sirf 4 cheezein StyleSheet mein — jo NativeWind handle nahi kar sakta
const styles = StyleSheet.create({
  heroRadius: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  progressCard: {
    marginTop: -20,        // negative margin — NativeWind support nahi karta
    shadowColor: "#9b5fc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  statsBorder: {
    borderTopWidth: 1,
    borderTopColor: "#f3eef8",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#f0eaf7",
  },
  resetBanner: {
    backgroundColor: "#fff8f0",
    borderLeftWidth: 3,
    borderLeftColor: "#e8a87c",
  },
});

export default ChallengeDetail;