import { useFocusEffect } from "@react-navigation/native";
import { Camera, ChefHat, LogOut, Plus, X } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "../../src/providers/AuthProvider";
import { querySql } from "../../src/services/db";
import { theme } from "../../src/theme";

type UserProfileRow = {
  id: number;
  email: string;
  fullName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  badgePrimary?: string | null;
  badgeSecondary?: string | null;
};

export default function Profile() {
  const { session, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const email = session?.email ?? "";

  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [editOpen, setEditOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [badgePrimary, setBadgePrimary] = useState("");
  const [badgeSecondary, setBadgeSecondary] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const initials = useMemo(() => {
    const n = (profile?.fullName ?? "").trim();
    if (!n) return "RB";
    const parts = n.split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("");
  }, [profile?.fullName]);

  const openEdit = useCallback(() => {
    setFullName(profile?.fullName ?? "");
    setBio(profile?.bio ?? "");
    setBadgePrimary(profile?.badgePrimary ?? "Recipe Newbie");
    setBadgeSecondary(profile?.badgeSecondary ?? "Food Critic");
    setAvatarUrl(profile?.avatarUrl ?? "");
    setEditOpen(true);
  }, [profile]);

  const loadProfile = useCallback(async () => {
    if (!email) return;
    setLoading(true);
    try {
      const rows = await querySql<UserProfileRow>(
        `SELECT id, email, fullName, bio, avatarUrl, badgePrimary, badgeSecondary
         FROM users WHERE email = ? LIMIT 1`,
        [email]
      );

      setProfile(rows[0] ?? null);
    } catch (e) {
      console.error("Failed to load profile", e);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const saveProfile = useCallback(async () => {
    if (!profile) return;
    const name = fullName.trim();
    const bioText = bio.trim();

    if (!name) {
      Alert.alert("Required", "Nama lengkap wajib diisi.");
      return;
    }

    try {
      await querySql(
        `UPDATE users
         SET fullName = ?, bio = ?, avatarUrl = ?, badgePrimary = ?, badgeSecondary = ?
         WHERE id = ?`,
        [name, bioText, avatarUrl.trim(), badgePrimary.trim(), badgeSecondary.trim(), profile.id]
      );
      setEditOpen(false);
      await loadProfile();
    } catch (e) {
      Alert.alert("Error", "Gagal menyimpan profil.");
    }
  }, [profile, fullName, bio, avatarUrl, badgePrimary, badgeSecondary, loadProfile]);

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={[styles.headerBar, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={signOut} style={styles.iconBtn}>
          <LogOut size={20} color={theme.colors.neutral.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Profile Card Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>{initials}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarBtn} onPress={openEdit}>
              <Camera size={14} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.nameText}>
            {profile?.fullName?.trim() ? profile.fullName : "Chef Unknown"}
          </Text>

          <Text style={styles.bioText}>
            {profile?.bio?.trim() ? profile.bio : "No bio yet. Start cooking!"}
          </Text>

          {/* Badges Row */}
          <View style={styles.badgesRow}>
            <View style={styles.badgePill}>
              <ChefHat size={12} color={theme.colors.primary.dark} />
              <Text style={styles.badgeText}>{profile?.badgePrimary || "Newbie"}</Text>
            </View>
            <View style={[styles.badgePill, styles.badgeSecondary]}>
              <Text style={[styles.badgeText, { color: "#B45309" }]}>{profile?.badgeSecondary || "Foodie"}</Text>
            </View>
          </View>

          {/* Stats Row (Dummy Data for Visual) */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Recipes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.4k</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>145</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity style={styles.editProfileBtn} onPress={openEdit}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.tabContainer}>
            <View style={styles.activeTab}>
              <Text style={styles.activeTabText}>My Recipes</Text>
              <View style={styles.activeIndicator} />
            </View>
            <View style={styles.inactiveTab}>
              <Text style={styles.inactiveTabText}>Saved</Text>
            </View>
          </View>

          {/* Grid Layout */}
          <View style={styles.grid}>
            {/* Create New Card */}
            <TouchableOpacity style={styles.createCard} onPress={() => Alert.alert("Coming Soon")}>
              <View style={styles.createIconBg}>
                <Plus size={24} color={theme.colors.primary.DEFAULT} />
              </View>
              <Text style={styles.createText}>New Recipe</Text>
            </TouchableOpacity>

            {/* Dummy Recipe 1 */}
            <View style={styles.miniCard}>
              <View style={styles.miniCardImagePlaceholder} />
              <View style={styles.miniCardContent}>
                <Text style={styles.miniCardTitle}>Avocado Toast</Text>
                <Text style={styles.miniCardMeta}>12 mins • Easy</Text>
              </View>
            </View>

            {/* Dummy Recipe 2 */}
            <View style={styles.miniCard}>
              <View style={styles.miniCardImagePlaceholder} />
              <View style={styles.miniCardContent}>
                <Text style={styles.miniCardTitle}>Beef Steak</Text>
                <Text style={styles.miniCardMeta}>45 mins • Hard</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal - Bottom Sheet Style */}
      <Modal visible={editOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditOpen(false)} style={styles.closeBtn}>
                <X size={20} color={theme.colors.neutral.dark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <Field label="Full Name" value={fullName} onChangeText={setFullName} />
              <Field label="Bio" value={bio} onChangeText={setBio} multiline />
              <Field label="Avatar URL" value={avatarUrl} onChangeText={setAvatarUrl} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Field label="Badge 1" value={badgePrimary} onChangeText={setBadgePrimary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Badge 2" value={badgeSecondary} onChangeText={setBadgeSecondary} />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

function Field({ label, value, onChangeText, multiline }: { label: string, value: string, onChangeText: (v: string) => void, multiline?: boolean }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        placeholder={`Enter your ${label.toLowerCase()}`}
        placeholderTextColor={theme.colors.neutral.medium}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" }, // Off-white elegant bg

  // Header Bar
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#F9FAFB",
    zIndex: 10,
  },
  headerSpacer: { width: 40 }, // Balance the icon on right
  headerTitle: { fontSize: 16, fontFamily: theme.font.bold, color: theme.colors.neutral.dark },
  iconBtn: { padding: 8, backgroundColor: "#fff", borderRadius: 20, borderWidth: 1, borderColor: "#E5E7EB" },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarImg: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: "#fff" },
  avatarFallback: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: theme.colors.neutral.light,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: "#fff"
  },
  avatarFallbackText: { fontSize: 32, fontFamily: theme.font.bold, color: theme.colors.neutral.medium },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: theme.colors.primary.DEFAULT,
    padding: 8, borderRadius: 20,
    borderWidth: 3, borderColor: "#fff",
  },

  nameText: { fontSize: 22, fontFamily: theme.font.bold, color: theme.colors.neutral.dark, marginBottom: 4 },
  bioText: { fontSize: 14, fontFamily: theme.font.regular, color: theme.colors.neutral.medium, textAlign: 'center', paddingHorizontal: 20, lineHeight: 20 },

  // Badges
  badgesRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  badgePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, backgroundColor: theme.colors.primary.bg,
  },
  badgeSecondary: { backgroundColor: "#FFF7ED" },
  badgeText: { fontSize: 12, fontFamily: theme.font.bold, color: theme.colors.primary.dark },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: "100%",
    justifyContent: 'space-between',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 18, fontFamily: theme.font.bold, color: theme.colors.neutral.dark },
  statLabel: { fontSize: 12, color: theme.colors.neutral.medium, fontFamily: theme.font.medium },
  statDivider: { width: 1, height: 24, backgroundColor: "#F3F4F6" },

  // Edit Btn
  editProfileBtn: {
    marginTop: 20,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    alignItems: 'center',
    backgroundColor: "transparent",
  },
  editProfileText: { fontSize: 14, fontFamily: theme.font.bold, color: theme.colors.neutral.dark },

  // Content
  contentSection: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    minHeight: 500,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.02, shadowRadius: 10,
    elevation: 5,
  },
  tabContainer: { flexDirection: 'row', marginBottom: 20 },
  activeTab: { marginRight: 24, alignItems: 'center' },
  activeTabText: { fontSize: 16, fontFamily: theme.font.bold, color: theme.colors.neutral.dark },
  activeIndicator: { width: 4, height: 4, borderRadius: 2, backgroundColor: theme.colors.primary.DEFAULT, marginTop: 4 },
  inactiveTab: { alignItems: 'center' },
  inactiveTabText: { fontSize: 16, fontFamily: theme.font.bold, color: theme.colors.neutral.medium },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  createCard: {
    width: "48%", aspectRatio: 0.85,
    borderRadius: 16, borderWidth: 2, borderColor: "#F3F4F6", borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', gap: 12,
  },
  createIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.primary.bg, justifyContent: 'center', alignItems: 'center' },
  createText: { fontSize: 14, fontFamily: theme.font.bold, color: theme.colors.neutral.medium },

  miniCard: {
    width: "48%", aspectRatio: 0.85,
    borderRadius: 16, backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#F3F4F6",
    overflow: 'hidden',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3,
  },
  miniCardImagePlaceholder: { flex: 1, backgroundColor: theme.colors.neutral.light },
  miniCardContent: { padding: 12 },
  miniCardTitle: { fontSize: 14, fontFamily: theme.font.bold, color: theme.colors.neutral.dark, marginBottom: 4 },
  miniCardMeta: { fontSize: 11, color: theme.colors.neutral.medium },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: "85%",
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontFamily: theme.font.bold, color: theme.colors.neutral.dark },
  closeBtn: { padding: 4, backgroundColor: "#F3F4F6", borderRadius: 20 },

  formContainer: { marginBottom: 20 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontFamily: theme.font.bold, color: theme.colors.neutral.dark, marginBottom: 8 },
  input: {
    backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, fontFamily: theme.font.regular, color: theme.colors.neutral.dark
  },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: 14, borderRadius: 14,
    alignItems: 'center',
  },
  saveButtonText: { color: "white", fontSize: 15, fontFamily: theme.font.bold },
});