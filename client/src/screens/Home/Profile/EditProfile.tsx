import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import api from "../../../api";

const EditProfile = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/user/profile");
      setName(res.data.name);
      setEmail(res.data.email);
    } catch {
      Alert.alert("Error", "Could not load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Validation", "Name and email cannot be empty.");
      return;
    }
    try {
      setSaving(true);
      await api.put("/api/user/profile", { name: name.trim(), email: email.trim() });
      Alert.alert("Success", "Profile updated!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ab73d1" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} keyboardShouldPersistTaps="handled">

      {/* ── Header ────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-left" size={20} color="#2d1b4e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.body}>

        {/* Name Field */}
        <Text style={styles.label}>Full Name</Text>
        <View style={styles.inputWrap}>
          <Icon name="user" size={16} color="#ab73d1" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#c4aad9"
            autoCapitalize="words"
          />
        </View>

        {/* Email Field */}
        <Text style={[styles.label, { marginTop: 20 }]}>Email Address</Text>
        <View style={styles.inputWrap}>
          <Icon name="mail" size={16} color="#ab73d1" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Your email"
            placeholderTextColor="#c4aad9"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f3fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f3fa" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
  },
  backBtn: {
    width: 36, height: 36, backgroundColor: "#fff",
    borderRadius: 12, justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#ede7f6",
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: "#2d1b4e" },
  body: { paddingHorizontal: 20, paddingTop: 8 },
  label: { fontSize: 13, fontWeight: "700", color: "#9b5fc4", letterSpacing: 0.5, marginBottom: 8 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ede7f6",
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2d1b4e" },
  saveBtn: {
    backgroundColor: "#ab73d1",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 36,
  },
  saveBtnDisabled: { backgroundColor: "#d4b8e8" },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700", letterSpacing: 0.5 },
});

export default EditProfile;