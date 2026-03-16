import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
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

const MyChallenges = () => {
  const navigation = useNavigation<any>();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyChallenges();
  }, []);

  const fetchMyChallenges = async () => {
    try {
      const res = await api.get("/api/challenges/my");
      setChallenges(res.data);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Failed to fetch challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleChallengePress = (challenge: Challenge) => {
    navigation.navigate("ChallengeDetail", { challenge });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#6b21a8" />
      </View>
    );
  }

  if (challenges.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-500 text-lg">You have not joined any challenges yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 pt-10">
      <Text className="text-xl font-bold mb-4">My Challenges</Text>
      {challenges.map((item) => (
        <TouchableOpacity
          key={item._id}
          className="bg-white rounded-xl mb-4 overflow-hidden shadow-md"
          onPress={() => handleChallengePress(item)}
        >
          <Image source={{ uri: item.image }} className="w-full h-40" resizeMode="cover" />
          <View className="p-3">
            <Text className="font-semibold text-lg">{item.title}</Text>
            <Text className="text-gray-500">{item.description}</Text>
            <Text className="mt-1 text-gray-600">{item.participants?.length || 0} participants</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default MyChallenges;