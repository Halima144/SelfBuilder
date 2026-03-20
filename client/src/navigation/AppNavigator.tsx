// AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import TabNavigator from "./TabNavigator"; // import your tabs
import ChallengeDetail from "../screens/Home/Challenges/ChallengeDetail";
import EditProfile from "../screens/Home/Profile/EditProfile";
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  HomeTabs: undefined; 
   ChallengeDetail: { challengeId: string };
   EditProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
        <Stack.Screen name="ChallengeDetail" component={ChallengeDetail} /> 
        <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}