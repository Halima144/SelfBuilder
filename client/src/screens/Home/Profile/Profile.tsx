import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import api from "../../../api";

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  enrolledCount?: number;
  completedCount?: number;
  badgeCount?: number;
}

const MENU_ITEMS = [
  { icon: "edit-2",      label: "Edit Profile",   route: "EditProfile" },
  { icon: "award",       label: "My Badges",       route: "Badges" },
  { icon: "settings",    label: "Settings",        route: "Settings" },
  { icon: "help-circle", label: "Help & Support",  route: "Support" },
];

const Profile = () => {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/user/profile");
      setProfile(res.data);
    } catch {
      Alert.alert("Error", "Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  // ── Avatar options ───────────────────────────
  const handleAvatarPress = () => {
    Alert.alert("Profile Photo", "Choose an option", [
      { text: "Camera",  onPress: openCamera },
      { text: "Gallery", onPress: openGallery },
      { text: "Cancel",  style: "cancel" },
    ]);
  };

  const openGallery = () => {
    launchImageLibrary(
      { mediaType: "photo", quality: 0.7, includeBase64: false },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        const uri = response.assets?.[0]?.uri;
        if (uri) uploadAvatar(uri);
      }
    );
  };

  const openCamera = () => {
    launchCamera(
      { mediaType: "photo", quality: 0.7, includeBase64: false, saveToPhotos: false },
      (response) => {
        if (response.didCancel || response.errorCode) return;
        const uri = response.assets?.[0]?.uri;
        if (uri) uploadAvatar(uri);
      }
    );
  };

  const uploadAvatar = async (uri: string) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("avatar", {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        type: "image/jpeg",
        name: "avatar.jpg",
      } as any);
      const res = await api.put("/api/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile((prev) => (prev ? { ...prev, avatar: res.data.avatar } : prev));
    } catch {
      Alert.alert("Upload failed", "Could not update profile photo. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          try { await api.post("/api/auth/logout"); } catch {}
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ab73d1" />
      </View>
    );
  }

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

      {/* ── Banner ──────────────────────────────── */}
      <View style={styles.banner}>
        <View style={styles.circleLarge} />
        <View style={styles.circleSmall} />

        <View style={styles.bellWrap}>
          <Icon name="bell" size={18} color="#fff" />
        </View>

        <View style={styles.avatarWrapper}>
          <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.85}>
            {uploading ? (
              <View style={styles.avatarPlaceholder}>
                <ActivityIndicator color="#ab73d1" />
              </View>
            ) : profile?.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
            <View style={styles.cameraBadge}>
              <Icon name="camera" size={11} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{profile?.name || "User"}</Text>
        <Text style={styles.userEmail}>{profile?.email || ""}</Text>
      </View>

      {/* ── Stats Card ──────────────────────────── */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{profile?.enrolledCount ?? 0}</Text>
          <Text style={styles.statLabel}>Enrolled</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{profile?.completedCount ?? 0}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{profile?.badgeCount ?? 0}</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View>

      {/* ── Menu ────────────────────────────────── */}
      <View style={styles.menuCard}>
        {MENU_ITEMS.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.menuItem,
              idx < MENU_ITEMS.length - 1 && styles.menuItemBorder,
            ]}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconWrap}>
              <Icon name={item.icon as any} size={16} color="#ab73d1" />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Icon name="chevron-right" size={16} color="#d4b8e8" />
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Logout ──────────────────────────────── */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.85}
      >
        <Icon name="log-out" size={16} color="#e07070" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {profile?.createdAt && (
        <Text style={styles.memberSince}>
          Member since{" "}
          {new Date(profile.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Text>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f3fa" },
  centered: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "#f5f3fa",
  },

  // Banner
  banner: {
    backgroundColor: "#ab73d1",
    paddingTop: 56, paddingBottom: 48,
    alignItems: "center",
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
    overflow: "hidden", position: "relative",
  },
  circleLarge: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.07)", top: -60, left: -60,
  },
  circleSmall: {
    position: "absolute", width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.07)", bottom: -30, right: -20,
  },
  bellWrap: {
    position: "absolute", top: 56, right: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20, padding: 8,
  },

  // Avatar
  avatarWrapper: { marginBottom: 14, position: "relative" },
  avatarImg: {
    width: 88, height: 88, borderRadius: 44,
    borderWidth: 3, borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 3, borderColor: "#fff",
    justifyContent: "center", alignItems: "center",
  },
  avatarInitials: {
    fontSize: 30, fontWeight: "800", color: "#fff", letterSpacing: 1,
  },
  cameraBadge: {
    position: "absolute", bottom: 2, right: 2,
    backgroundColor: "#7c4daa", borderRadius: 12,
    width: 24, height: 24,
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  userName: {
    fontSize: 22, fontWeight: "800", color: "#fff",
    letterSpacing: 0.3, marginBottom: 4,
  },
  userEmail: { fontSize: 13, color: "rgba(255,255,255,0.75)" },

  // Stats
  statsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20, marginTop: -22,
    borderRadius: 20, padding: 20,
    flexDirection: "row",
    shadowColor: "#9b5fc4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 5,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 22, fontWeight: "800", color: "#2d1b4e" },
  statLabel: { fontSize: 11, color: "#b0a0c0", marginTop: 3, letterSpacing: 0.5 },
  statDivider: { width: 1, backgroundColor: "#f0eaf7", marginVertical: 4 },

  // Menu
  menuCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20, marginTop: 16,
    borderRadius: 20, paddingVertical: 4,
    borderWidth: 1, borderColor: "#ede7f6",
    shadowColor: "#9b5fc4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 16,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: "#f5f0fb" },
  menuIconWrap: {
    width: 34, height: 34, backgroundColor: "#f3eaf9",
    borderRadius: 10, justifyContent: "center",
    alignItems: "center", marginRight: 14,
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: "#2d1b4e" },

  // Logout
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    marginHorizontal: 20, marginTop: 16,
    backgroundColor: "#fff0f0", borderRadius: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: "#f5c5c5",
  },
  logoutText: { fontSize: 14, fontWeight: "700", color: "#e07070" },

  memberSince: {
    textAlign: "center", marginTop: 16,
    fontSize: 11, color: "#c4aad9", letterSpacing: 0.5,
  },
});

export default Profile;