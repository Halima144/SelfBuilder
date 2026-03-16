import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "selfbuilder_user";

export const loginUser = async (user: object) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};