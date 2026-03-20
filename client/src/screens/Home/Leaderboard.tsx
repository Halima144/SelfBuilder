import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, FlatList, ActivityIndicator,
  Alert, StyleSheet, TouchableOpacity, RefreshControl, Modal,
} from "react-native";
import api from "../../api";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  totalCompleted: number;
  challengesJoined: number;
  bestStreak: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  currentUserRank: number;
  currentUserId: string;
}

const MEDAL = ["🥇", "🥈", "🥉"];
type FilterType = "alltime" | "weekly";

const CATEGORIES = [
  { key: "all",          label: "All" },
  { key: "Productivity", label: "📋 Productivity" },
  { key: "Mindset",      label: "🧠 Mindset" },
  { key: "Health",       label: "💪 Health" },
  { key: "Career",       label: "🚀 Career" },
];

const Leaderboard = () => {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("alltime");
  const [category, setCategory] = useState("all");

  const fetchLeaderboard = async (isRefresh = false, f = filter, c = category) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await api.get(`/api/leaderboard?filter=${f}&category=${c}`);
      setData(res.data);
    } catch {
      Alert.alert("Error", "Failed to load leaderboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(false, filter, category);
  }, [filter, category]);

  const onRefresh = useCallback(() => fetchLeaderboard(true, filter, category), [filter, category]);

  const renderItem = ({ item }: { item: LeaderboardEntry }) => {
    const isCurrentUser = data?.currentUserId === item.userId;
    const isTop3 = item.rank <= 3;

    return (
      <View style={[styles.card, isCurrentUser && styles.cardHighlight, isTop3 && styles.cardTop3]}>
        {/* Rank */}
        <View style={styles.rankBox}>
          {isTop3 ? (
            <Text style={styles.medal}>{MEDAL[item.rank - 1]}</Text>
          ) : (
            <Text style={[styles.rankText, isCurrentUser && styles.rankTextHighlight]}>
              {item.rank}
            </Text>
          )}
        </View>

        {/* Avatar */}
        <View style={[styles.avatar, isCurrentUser && styles.avatarHighlight]}>
          <Text style={styles.avatarText}>{item.name?.charAt(0)?.toUpperCase() || "?"}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.nameText} numberOfLines={1}>
            {item.name}
            {isCurrentUser && <Text style={styles.youBadge}> (You)</Text>}
          </Text>
          <Text style={styles.subText}>
            🔥 {item.bestStreak} streak · {item.challengesJoined} challenge{item.challengesJoined !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreBox}>
          <Text style={[styles.scoreNum, isCurrentUser && styles.scoreHighlight]}>
            {item.totalCompleted}
          </Text>
          <Text style={styles.scoreLabel}>days</Text>
        </View>
      </View>
    );
  };

  const ListHeader = () => (
    <View>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🏆</Text>
        <Text style={styles.heroTitle}>Leaderboard</Text>
        <Text style={styles.heroSub}>
          {filter === "weekly" ? "This week's top challengers" : "All-time top challengers"}
        </Text>
        {data?.currentUserRank && data.currentUserRank > 0 ? (
          <View style={styles.myRankChip}>
            <Text style={styles.myRankText}>Your Rank: #{data.currentUserRank}</Text>
          </View>
        ) : null}
      </View>

      {/* Time Filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "alltime" && styles.filterBtnActive]}
          onPress={() => setFilter("alltime")} activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filter === "alltime" && styles.filterTextActive]}>
            All Time
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "weekly" && styles.filterBtnActive]}
          onPress={() => setFilter("weekly")} activeOpacity={0.8}
        >
          <Text style={[styles.filterText, filter === "weekly" && styles.filterTextActive]}>
            This Week
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.catRow}
        renderItem={({ item: cat }) => (
          <TouchableOpacity
            style={[styles.catChip, category === cat.key && styles.catChipActive]}
            onPress={() => setCategory(cat.key)} activeOpacity={0.8}
          >
            <Text style={[styles.catText, category === cat.key && styles.catTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Column Headers */}
      <View style={styles.colHeader}>
        <Text style={styles.colHeaderText}>Rank</Text>
        <Text style={[styles.colHeaderText, { flex: 1, marginLeft: 48 }]}>Player</Text>
        <Text style={styles.colHeaderText}>Days</Text>
      </View>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyBox}>
      <Text style={styles.emptyEmoji}>🌟</Text>
      <Text style={styles.emptyTitle}>No data yet</Text>
      <Text style={styles.emptySub}>
        {filter === "weekly"
          ? "No activity this week. Start a challenge!"
          : "Complete challenges to appear here!"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ab73d1" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.root}
      data={data?.leaderboard || []}
      keyExtractor={(item) => item.userId}
      renderItem={renderItem}
      ListHeaderComponent={<ListHeader />}
      ListEmptyComponent={<ListEmpty />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ab73d1" colors={["#ab73d1"]} />
      }
    />
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f3fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f3fa" },
  listContent: { paddingBottom: 40 },

  hero: {
    backgroundColor: "#ab73d1", paddingTop: 56, paddingBottom: 36,
    alignItems: "center", borderBottomLeftRadius: 28, borderBottomRightRadius: 28, marginBottom: 8,
  },
  heroEmoji: { fontSize: 44, marginBottom: 8 },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 4 },
  myRankChip: {
    marginTop: 14, backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 50, paddingHorizontal: 16, paddingVertical: 6,
  },
  myRankText: { color: "#fff", fontSize: 13, fontWeight: "700" },

  filterRow: {
    flexDirection: "row", marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    backgroundColor: "#ede7f6", borderRadius: 12, padding: 4,
  },
  filterBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: "center" },
  filterBtnActive: { backgroundColor: "#ab73d1" },
  filterText: { fontSize: 13, fontWeight: "600", color: "#9b8ab0" },
  filterTextActive: { color: "#fff" },

  catRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  catChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: "#ede7f6",
    borderWidth: 1, borderColor: "#e0d4f0",
  },
  catChipActive: { backgroundColor: "#ab73d1", borderColor: "#ab73d1" },
  catText: { fontSize: 12, fontWeight: "600", color: "#9b8ab0" },
  catTextActive: { color: "#fff" },

  colHeader: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 10,
  },
  colHeaderText: { fontSize: 11, fontWeight: "700", color: "#b0a0c0", letterSpacing: 1, textTransform: "uppercase" },

  card: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    marginHorizontal: 16, marginVertical: 5, borderRadius: 16, padding: 14,
    shadowColor: "#9b5fc4", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    borderWidth: 1, borderColor: "#f0eaf7",
  },
  cardTop3: { borderColor: "#d4b8e8", backgroundColor: "#fdf9ff" },
  cardHighlight: { borderColor: "#ab73d1", backgroundColor: "#faf5ff", shadowOpacity: 0.18, elevation: 6 },

  rankBox: { width: 34, alignItems: "center", justifyContent: "center" },
  rankText: { fontSize: 14, fontWeight: "700", color: "#b0a0c0" },
  rankTextHighlight: { color: "#ab73d1" },
  medal: { fontSize: 22 },

  avatar: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: "#ede7f6",
    alignItems: "center", justifyContent: "center", marginHorizontal: 10,
  },
  avatarHighlight: { backgroundColor: "#d4b8e8" },
  avatarText: { fontSize: 17, fontWeight: "800", color: "#7c4daa" },

  info: { flex: 1 },
  nameText: { fontSize: 14, fontWeight: "700", color: "#2d1b4e" },
  youBadge: { fontSize: 12, fontWeight: "600", color: "#ab73d1" },
  subText: { fontSize: 11, color: "#b0a0c0", marginTop: 2 },

  scoreBox: { alignItems: "center", minWidth: 44 },
  scoreNum: { fontSize: 20, fontWeight: "800", color: "#2d1b4e" },
  scoreHighlight: { color: "#ab73d1" },
  scoreLabel: { fontSize: 10, color: "#b0a0c0", fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },

  emptyBox: { alignItems: "center", paddingTop: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#2d1b4e", marginBottom: 6 },
  emptySub: { fontSize: 13, color: "#b0a0c0", textAlign: "center", lineHeight: 20 },
});

export default Leaderboard;