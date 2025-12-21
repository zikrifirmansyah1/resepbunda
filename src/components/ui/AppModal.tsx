import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { theme } from "../../theme";

type Variant = "default" | "danger" | "success";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  variant?: Variant;
  primaryLabel?: string; // default: "OK"
};

export default function AppModal({
  visible,
  title,
  message,
  onClose,
  variant = "default",
  primaryLabel = "OK",
}: Props) {
  const accent =
    variant === "danger"
      ? theme.colors.danger
      : variant === "success"
      ? theme.colors.primary.DEFAULT
      : theme.colors.primary.DEFAULT;

  const iconName =
    variant === "danger"
      ? "alert-circle-outline"
      : variant === "success"
      ? "checkmark-circle-outline"
      : "information-circle-outline";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* klik di luar untuk menutup */}
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />

        <View style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary.bg }]}>
              <Ionicons name={iconName} size={20} color={accent} />
            </View>

            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={theme.colors.neutral.medium} />
            </Pressable>
          </View>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={[styles.primaryBtn, { backgroundColor: accent }]}>
              <Text style={styles.primaryText}>{primaryLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)", // slate-900 overlay
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.neutral.bg,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },

  title: {
    fontSize: 18,
    color: theme.colors.neutral.dark,
    fontFamily: theme.font.bold,
  },

  message: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: theme.colors.neutral.medium,
    fontFamily: theme.font.regular,
  },

  actions: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  primaryBtn: {
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === "ios" ? 12 : 11,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: theme.font.semibold,
  },
});
