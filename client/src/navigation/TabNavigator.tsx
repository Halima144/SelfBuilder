import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Feather";

import Home from "../screens/Home/Home";
import MyChallenges from "../screens/Home/MyChallenges";
import Profile from "../screens/Home/Profile";
import Feedback from "../screens/Home/Feedback";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4f46e5",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";

          if (route.name === "Home") iconName = "home";
          if (route.name === "MyChallenges") iconName = "check-circle";
          if (route.name === "Feedback") iconName = "edit";
          if (route.name === "Profile") iconName = "user";

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="MyChallenges" component={MyChallenges} />
      <Tab.Screen name="Feedback" component={Feedback} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}