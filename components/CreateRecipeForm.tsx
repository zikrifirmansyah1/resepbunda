import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { theme } from "../src/theme";

export default function CreateRecipeForm() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);

  const addIngredient = () => setIngredients((prev) => [...prev, ""]);
  const addStep = () => setSteps((prev) => [...prev, ""]);

  const updateIngredient = (i: number, v: string) =>
    setIngredients((prev) => prev.map((x, idx) => (idx === i ? v : x)));

  const updateStep = (i: number, v: string) =>
    setSteps((prev) => prev.map((x, idx) => (idx === i ? v : x)));

  function onSave() {
    // MVP: nanti sambungkan ke SQLite/AsyncStorage
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.neutral.bg }}>
      {/* Header */}
      <View
        style={{
          paddingTop: 16,
          paddingBottom: 14,
          paddingHorizontal: theme.spacing.lg,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.neutral.light,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="chevron-back" size={22} color={theme.colors.neutral.dark} />
        </Pressable>

        <Text style={{ fontFamily: theme.font.bold, fontSize: 16, color: theme.colors.neutral.dark }}>
          Tulis Resep
        </Text>

        <Pressable
          onPress={onSave}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="checkmark" size={22} color={theme.colors.primary.DEFAULT} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.lg,
          paddingBottom: 120,
          gap: 14,
        }}
      >
        {/* Foto placeholder */}
        <Pressable
          style={{
            height: 160,
            borderRadius: theme.radius.lg,
            backgroundColor: "#fff",
            borderWidth: 1,
            borderColor: theme.colors.neutral.light,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Ionicons name="image-outline" size={28} color={theme.colors.neutral.medium} />
          <Text style={{ fontFamily: theme.font.medium, color: theme.colors.neutral.medium }}>
            Tambahkan Foto
          </Text>
          <Text style={{ fontFamily: theme.font.regular, fontSize: 12, color: theme.colors.neutral.medium }}>
            (MVP: belum upload)
          </Text>
        </Pressable>

        <Field label="Judul Resep">
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Contoh: Sop Ayam Jahe"
            placeholderTextColor={theme.colors.neutral.medium}
            style={inputStyle}
          />
        </Field>

        <Field label="Estimasi Durasi (menit)">
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="Contoh: 45"
            keyboardType="number-pad"
            placeholderTextColor={theme.colors.neutral.medium}
            style={inputStyle}
          />
        </Field>

        <Section title="Bahan-bahan" actionText="+ Tambah Bahan" onAction={addIngredient}>
          {ingredients.map((val, idx) => (
            <TextInput
              key={idx}
              value={val}
              onChangeText={(v) => updateIngredient(idx, v)}
              placeholder={`Bahan ${idx + 1}`}
              placeholderTextColor={theme.colors.neutral.medium}
              style={[inputStyle, { marginTop: idx === 0 ? 0 : 10 }]}
            />
          ))}
        </Section>

        <Section title="Langkah Pembuatan" actionText="+ Tambah Langkah" onAction={addStep}>
          {steps.map((val, idx) => (
            <TextInput
              key={idx}
              value={val}
              onChangeText={(v) => updateStep(idx, v)}
              placeholder={`Langkah ${idx + 1}`}
              placeholderTextColor={theme.colors.neutral.medium}
              multiline
              style={[
                inputStyle,
                { marginTop: idx === 0 ? 0 : 10, minHeight: 54, textAlignVertical: "top" as any },
              ]}
            />
          ))}
        </Section>

        <Pressable
          onPress={onSave}
          style={{
            backgroundColor: theme.colors.primary.DEFAULT,
            paddingVertical: 14,
            borderRadius: theme.radius.pill,
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <Text style={{ color: "#fff", fontFamily: theme.font.semibold, fontSize: 14 }}>
            Simpan Resep
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontFamily: theme.font.medium, color: theme.colors.neutral.dark, fontSize: 13 }}>
        {label}
      </Text>
      <View
        style={{
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: theme.colors.neutral.light,
          borderRadius: theme.radius.lg,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function Section({
  title,
  actionText,
  onAction,
  children,
}: {
  title: string;
  actionText: string;
  onAction: () => void;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: theme.colors.neutral.light,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontFamily: theme.font.bold, color: theme.colors.neutral.dark, fontSize: 14 }}>
          {title}
        </Text>
        <Pressable onPress={onAction}>
          <Text style={{ fontFamily: theme.font.semibold, color: theme.colors.primary.DEFAULT, fontSize: 12 }}>
            {actionText}
          </Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

const inputStyle = {
  fontFamily: theme.font.regular,
  fontSize: 14,
  color: theme.colors.neutral.dark,
};
