import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use localhost for USB / emulator. Change IP if using device on same Wi-Fi
const BASE_URL = "http://localhost:5000";

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Add token automatically to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Export the api instance
export default api;