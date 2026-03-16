import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/api/auth/signup", {
        name,
        email,
        password,
      });
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
      }
      navigation.replace("HomeTabs");
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#f5f3fa]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top decoration */}
        <View className="w-72 h-72 rounded-full bg-[#ab73d1]/20 absolute -top-16 -right-16" />
        <View className="w-40 h-40 rounded-full bg-[#ab73d1]/10 absolute top-32 -left-10" />

        <View className="flex-1 justify-center px-6 pt-24 pb-10">

          {/* Title */}
          <View className="mb-10">
            <Text className="text-[32px] font-bold text-[#2d1b4e] mb-1">
              Create account
            </Text>
            <Text className="text-sm text-[#9b8ab0]">
              Start your self-building journey today
            </Text>
          </View>

          {/* Name Field */}
          <View className="mb-4">
            <Text className="text-xs font-semibold text-[#9b5fc4] uppercase tracking-widest mb-2">
              Full Name
            </Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#c4aad9"
              value={name}
              onChangeText={setName}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              className={`bg-white rounded-2xl px-5 py-4 text-[#2d1b4e] text-sm border ${
                nameFocused ? "border-[#ab73d1]" : "border-[#ede7f6]"
              }`}
            />
          </View>

          {/* Email Field */}
          <View className="mb-4">
            <Text className="text-xs font-semibold text-[#9b5fc4] uppercase tracking-widest mb-2">
              Email
            </Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#c4aad9"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              className={`bg-white rounded-2xl px-5 py-4 text-[#2d1b4e] text-sm border ${
                emailFocused ? "border-[#ab73d1]" : "border-[#ede7f6]"
              }`}
            />
          </View>

          {/* Password Field */}
          <View className="mb-8">
            <Text className="text-xs font-semibold text-[#9b5fc4] uppercase tracking-widest mb-2">
              Password
            </Text>
            <TextInput
              placeholder="Create a password"
              placeholderTextColor="#c4aad9"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              className={`bg-white rounded-2xl px-5 py-4 text-[#2d1b4e] text-sm border ${
                passFocused ? "border-[#ab73d1]" : "border-[#ede7f6]"
              }`}
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.85}
            className={`rounded-2xl py-4 items-center mb-4 ${
              loading ? "bg-[#d4b8e8]" : "bg-[#ab73d1]"
            }`}
          >
            <Text className="text-white font-bold text-base tracking-wide">
              {loading ? "Creating account..." : "Create Account"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-[#ede7f6]" />
            <Text className="text-[#c4aad9] text-xs px-3">or</Text>
            <View className="flex-1 h-px bg-[#ede7f6]" />
          </View>

          {/* Login Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-sm text-[#9b8ab0]">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
            >
              <Text className="text-sm font-bold text-[#9b5fc4]">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;