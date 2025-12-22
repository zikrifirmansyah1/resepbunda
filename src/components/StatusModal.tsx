import { CheckCircle2, XCircle } from "lucide-react-native";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../theme";

export default function StatusModal({
  visible,
  variant,
  title,
  message,
  buttonText,
  onClose,
}: {
  visible: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}) {
  const Icon = variant === "success" ? CheckCircle2 : XCircle;
  const iconColor = variant === "success" ? theme.colors.primary.DEFAULT : "#E11D48";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={[styles.iconWrap, { borderColor: iconColor }]}>
            <Icon size={28} color={iconColor} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText || "OK"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", padding: 20 },
  card: { width: "100%", maxWidth: 360, backgroundColor: "white", borderRadius: 16, padding: 18, alignItems: "center" },
  iconWrap: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  title: { fontFamily: theme.font.bold, fontSize: 18, color: theme.colors.neutral.dark, marginBottom: 6 },
  message: { fontFamily: theme.font.regular, fontSize: 14, color: theme.colors.neutral.medium, textAlign: "center", marginBottom: 14, lineHeight: 20 },
  button: { height: 44, minWidth: 120, borderRadius: 12, backgroundColor: theme.colors.primary.DEFAULT, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 },
  buttonText: { fontFamily: theme.font.bold, color: "white", fontSize: 14 },
});
