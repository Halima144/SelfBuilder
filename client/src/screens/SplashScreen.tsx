import React from "react";
import { View, Image } from "react-native";

const SplashScreen = () => {
  return (
    <View className="flex-1 bg-blue-600 justify-center items-center">
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 180, height: 180 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;