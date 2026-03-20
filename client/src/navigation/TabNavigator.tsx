import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";

import Home from "../screens/Home/Home";
import MyChallenges from "../screens/Home/MyChallenges";
import Profile from "../screens/Home/Profile/Profile";
// import Feedback from "../screens/Home/Leaderboard";
import Leaderboard from "../screens/Home/Leaderboard";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#ab73d1",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";

          if (route.name === "Home") iconName = "home";
          if (route.name === "MyChallenges") iconName = "check-circle";
          if (route.name === "Leaderboard") iconName = "award";
          if (route.name === "Profile") iconName = "user";

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="MyChallenges" component={MyChallenges} />
      <Tab.Screen name="Leaderboard" component={Leaderboard} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}