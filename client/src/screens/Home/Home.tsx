import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import api from "../../api";

interface Challenge {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  image: string;
  participants: string[];
}

const categories = ["All", "Productivity", "Mindset", "Health", "Career"];

const Home = () => {
  const navigation = useNavigation<any>();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSuccess, setDialogSuccess] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await api.get("/api/challenges");
      setChallenges(res.data);
      setFilteredChallenges(res.data);
    } catch (err: any) {
      console.log("Fetch error:", err.response || err.message);
    }
  };

  const filterCategory = (category: string) => {
    setSelectedCategory(category);
    setFilteredChallenges(
      category === "All"
        ? challenges
        : challenges.filter((c) => c.category === category)
    );
  };

  const enrollChallenge = async (id: string) => {
    try {
      await api.post(`/api/challenges/enroll/${id}`);
      setDialogSuccess(true);
      setDialogMessage("Successfully enrolled in this challenge.");
      setDialogVisible(true);
      fetchChallenges();
    } catch (err: any) {
      const message = err.response?.data?.message || "";
      setDialogSuccess(false);
      setDialogMessage(
        message.toLowerCase().includes("already")
          ? "You are already enrolled in this challenge."
          : "Enrollment failed. Please try again."
      );
      setDialogVisible(true);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#f5f3fa]"
      showsVerticalScrollIndicator={false}
    >
      {/* ── Header ─────────────────────────────── */}
      <View className="px-5 pt-14 pb-4 flex-row justify-between items-center">
        <View>
          <Text className="text-[22px] font-bold text-[#2d1b4e]">
            Hello there
          </Text>
          <Text className="text-sm text-[#9b8ab0] mt-0.5">
            Build a better version of yourself
          </Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-white items-center justify-center border border-[#ede7f6]">
          <Icon name="bell" size={18} color="#ab73d1" />
        </View>
      </View>

      {/* ── Categories ─────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-5 mt-1"
        contentContainerStyle={{ gap: 8, paddingRight: 20 }}
      >
        {categories.map((cat, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => filterCategory(cat)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === cat
                ? "bg-[#ab73d1]"
                : "bg-white border border-[#ede7f6]"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedCategory === cat ? "text-white" : "text-[#9b8ab0]"
              }`}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Featured Cards (Horizontal) ────────── */}
      <Text className="text-base font-bold text-[#2d1b4e] px-5 mt-6 mb-3">
        Explore Challenges
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-5"
        contentContainerStyle={{ gap: 14, paddingRight: 20 }}
      >
        {filteredChallenges.map((item) => (
          <View
            key={item._id}
            className="bg-white rounded-2xl overflow-hidden border border-[#ede7f6]"
            style={{ width: 158 }} // fixed width — equal cards
          >
            {/* Image */}
            <View className="relative">
              <Image
                source={{ uri: item.image }}
                className="w-full h-28 rounded-t-2xl"
                resizeMode="cover"
              />
              {/* Duration Badge */}
              <View className="absolute top-2 right-2 bg-[#2d1b4e]/70 rounded-full px-2 py-0.5">
                <Text className="text-[10px] font-bold text-white tracking-wide">
                  {item.duration} DAYS
                </Text>
              </View>
            </View>

            {/* Body */}
            <View className="p-3">
              <Text className="text-[10px] font-bold text-[#ab73d1] tracking-widest uppercase mb-1">
                {item.category}
              </Text>
              <Text
                className="text-sm font-bold text-[#2d1b4e] leading-5 mb-1"
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <Text className="text-[11px] text-[#b0a0c0] mb-3">
                {item.participants?.length || 0} joined
              </Text>
              <TouchableOpacity
                className="bg-[#ab73d1] rounded-xl py-2 items-center"
                onPress={() => enrollChallenge(item._id)}
                activeOpacity={0.85}
              >
                <Text className="text-white text-[12px] font-bold tracking-wide">
                  Join Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ── All Challenges (Vertical List) ─────── */}
      <Text className="text-base font-bold text-[#2d1b4e] px-5 mt-8 mb-3">
        All Challenges
      </Text>

      <View className="px-5 pb-10">
        {filteredChallenges.map((item) => (
          <View
            key={item._id}
            className="bg-white rounded-2xl mb-3 overflow-hidden border border-[#ede7f6] flex-row"
          >
            {/* Image */}
            <Image
              source={{ uri: item.image }}
              className="w-24 h-full rounded-l-2xl"
              resizeMode="cover"
            />

            {/* Info */}
            <View className="flex-1 p-3 justify-between">
              <View>
                <Text className="text-[10px] font-bold text-[#ab73d1] tracking-widest uppercase mb-0.5">
                  {item.category}
                </Text>
                <Text
                  className="text-sm font-bold text-[#2d1b4e] leading-5"
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-[11px] text-[#9b8ab0] mt-1"
                  numberOfLines={1}
                >
                  {item.description}
                </Text>
              </View>

              <View className="flex-row items-center justify-between mt-2">
                <View className="bg-[#f3eaf9] rounded-full px-2 py-0.5">
                  <Text className="text-[10px] font-bold text-[#9b5fc4]">
                    {item.duration} Days
                  </Text>
                </View>
                <TouchableOpacity
                  className="bg-[#ab73d1] rounded-lg px-3 py-1.5"
                  onPress={() => enrollChallenge(item._id)}
                  activeOpacity={0.85}
                >
                  <Text className="text-white text-[11px] font-bold">
                    Join
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* ── Dialog Modal ───────────────────────── */}
      <Modal visible={dialogVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40 px-8">
          <View className="bg-white rounded-2xl p-6 w-full">

            <View
              className={`w-10 h-1 rounded-full self-center mb-4 ${
                dialogSuccess ? "bg-[#ab73d1]" : "bg-red-300"
              }`}
            />

            <Text className="text-base font-bold text-[#2d1b4e] text-center mb-2">
              {dialogSuccess ? "You're in!" : "Oops"}
            </Text>

            <Text className="text-sm text-[#9b8ab0] text-center leading-5 mb-5">
              {dialogMessage}
            </Text>

            <TouchableOpacity
              className={`rounded-xl py-3 items-center ${
                dialogSuccess ? "bg-[#ab73d1]" : "bg-[#f3eaf9]"
              }`}
              onPress={() => setDialogVisible(false)}
            >
              <Text
                className={`text-sm font-bold ${
                  dialogSuccess ? "text-white" : "text-[#9b5fc4]"
                }`}
              >
                {dialogSuccess ? "Let's Go" : "Close"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Home;