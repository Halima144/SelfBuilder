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

const Login = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/api/auth/login", { email, password });
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        navigation.replace("HomeTabs");
      } else {
        Alert.alert("Login Failed", "No token received.");
      }
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
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
              Welcome back
            </Text>
            <Text className="text-sm text-[#9b8ab0]">
              Sign in to continue your journey
            </Text>
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
          <View className="mb-2">
            <Text className="text-xs font-semibold text-[#9b5fc4] uppercase tracking-widest mb-2">
              Password
            </Text>
            <TextInput
              placeholder="Enter your password"
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

          {/* Forgot Password */}
          <TouchableOpacity className="self-end mb-8">
            <Text className="text-sm text-[#ab73d1] font-semibold">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
            className={`rounded-2xl py-4 items-center mb-4 ${
              loading ? "bg-[#d4b8e8]" : "bg-[#ab73d1]"
            }`}
          >
            <Text className="text-white font-bold text-base tracking-wide">
              {loading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-[#ede7f6]" />
            <Text className="text-[#c4aad9] text-xs px-3">or</Text>
            <View className="flex-1 h-px bg-[#ede7f6]" />
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-sm text-[#9b8ab0]">
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              activeOpacity={0.7}
            >
              <Text className="text-sm font-bold text-[#9b5fc4]">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;