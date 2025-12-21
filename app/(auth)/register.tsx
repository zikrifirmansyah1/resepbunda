import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../src/providers/AuthProvider";
import { theme } from "../../src/theme";

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function RegisterScreen() {
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const heroUri = useMemo(
    () => "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1740&auto=format&fit=crop",
    []
  );

  async function onRegister() {
    if (!name.trim()) return Alert.alert("Ups!", "Nama lengkap belum diisi.");
    if (!email.trim() || !isEmailValid(email)) return Alert.alert("Ups!", "Format email tidak valid.");
    if (password.length < 6) return Alert.alert("Ups!", "Kata sandi minimal 6 karakter.");

    setLoading(true);
    try {
      await signUp(email.trim().toLowerCase(), password, name.trim());
      Alert.alert("Berhasil", "Akun berhasil dibuat. Silakan masuk.", [{ text: "Oke", onPress: () => router.back() }]);
    } catch (err: any) {
      Alert.alert("Gagal", err?.message || "Terjadi kesalahan saat mendaftar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground source={{ uri: heroUri }} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.darkOverlay} />

      <KeyboardAvoidingView behavior={Platform.select({ ios: "padding", android: undefined })} style={{ flex: 1 }}>
        {/* Back */}
        <View style={styles.backButtonContainer}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={theme.colors.neutral.dark} />
          </Pressable>
        </View>

        <View style={styles.bottomContainerOuter}>
          <View style={styles.bottomSheet}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <View style={{ marginBottom: 22 }}>
                <Text style={styles.titleText}>Buat Akun Baru</Text>
                <Text style={styles.subtitleText}>Biar bisa simpan resep, catatan masak, dan favoritmu.</Text>
              </View>

              <View style={{ gap: 14 }}>
                {/* Nama */}
                <View>
                  <Text style={styles.label}>Nama Lengkap</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={18} color={theme.colors.neutral.medium} />
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Nama panggilanmu"
                      style={styles.textInput}
                      placeholderTextColor={theme.colors.neutral.medium}
                    />
                  </View>
                </View>

                {/* Email */}
                <View>
                  <Text style={styles.label}>Alamat Email</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={18} color={theme.colors.neutral.medium} />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="nama@email.com"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={styles.textInput}
                      placeholderTextColor={theme.colors.neutral.medium}
                    />
                  </View>
                </View>

                {/* Password */}
                <View>
                  <Text style={styles.label}>Buat Kata Sandi</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={18} color={theme.colors.neutral.medium} />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Minimal 6 karakter"
                      secureTextEntry={!showPass}
                      style={styles.textInput}
                      placeholderTextColor={theme.colors.neutral.medium}
                    />
                    <Pressable onPress={() => setShowPass((v) => !v)} style={{ padding: 4 }}>
                      <Ionicons
                        name={showPass ? "eye-off-outline" : "eye-outline"}
                        size={18}
                        color={theme.colors.neutral.medium}
                      />
                    </Pressable>
                  </View>
                </View>

                {/* Button */}
                <Pressable
                  onPress={onRegister}
                  disabled={loading}
                  style={[styles.primaryButton, loading && { opacity: 0.75 }]}
                >
                  <Text style={styles.primaryButtonText}>{loading ? "Memproses..." : "Daftar Sekarang"}</Text>
                </Pressable>

                {/* Link login */}
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10, gap: 5 }}>
                  <Text style={{ color: theme.colors.neutral.medium, fontFamily: theme.font.regular }}>
                    Sudah punya akun?
                  </Text>
                  <Pressable onPress={() => router.back()}>
                    <Text style={{ color: theme.colors.primary.DEFAULT, fontFamily: theme.font.semibold }}>
                      Masuk
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Text style={styles.footerText}>
                Dengan mendaftar, kamu setuju dengan Kebijakan Privasi kami.
              </Text>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },

  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  backButtonContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(248,250,252,0.92)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  bottomContainerOuter: { flex: 1, justifyContent: "flex-end" },

  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 28,
    height: "80%",
    borderTopWidth: 1,
    borderColor: theme.colors.neutral.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },

  titleText: {
    fontSize: 26,
    color: theme.colors.neutral.dark,
    textAlign: "center",
    marginBottom: 8,
    fontFamily: theme.font.bold,
  },
  subtitleText: {
    fontSize: 14,
    color: theme.colors.neutral.medium,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: theme.font.regular,
    paddingHorizontal: 12,
  },

  label: {
    fontSize: 13,
    color: theme.colors.neutral.dark,
    marginBottom: 8,
    fontFamily: theme.font.medium,
  },

  inputContainer: {
    backgroundColor: theme.colors.neutral.bg,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  textInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.neutral.dark,
    fontFamily: theme.font.regular,
  },

  primaryButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingVertical: 16,
    borderRadius: theme.radius.pill,
    alignItems: "center",
    marginTop: 14,
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: theme.font.bold,
  },

  footerText: {
    marginTop: 26,
    textAlign: "center",
    fontSize: 11,
    color: theme.colors.neutral.medium,
    lineHeight: 16,
    fontFamily: theme.font.regular,
  },
});
