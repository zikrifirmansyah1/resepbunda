import { router, Stack, useLocalSearchParams } from "expo-router";
import { ArrowLeft, CheckCircle2, ChefHat, Clock, Flame, Heart, PlayCircle, Share2, Users } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Share, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { querySql } from "../../src/services/db";
import { theme } from "../../src/theme";
import type { Recipe } from "../../src/types/recipe";

// Helper remains the same
function toStrArray(v: any): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map(String);
      return [];
    } catch {
      return [s];
    }
  }
  return [];
}

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const recipeId = Number(id);
        if (!Number.isFinite(recipeId)) return;
        const rows = await querySql<Recipe>("SELECT * FROM recipes WHERE id = ? LIMIT 1", [recipeId]);
        setRecipe(rows[0] ?? null);
      } catch (e) {
        console.error("Failed to fetch recipe details", e);
        setRecipe(null);
      }
    })();
  }, [id]);

  const ingredients = useMemo(() => toStrArray((recipe as any)?.ingredients), [recipe]);
  const steps = useMemo(() => toStrArray((recipe as any)?.steps), [recipe]);

  async function onShare() {
    if (!recipe) return;
    try {
      await Share.share({
        message: `Check out this recipe: ${recipe.title}\n\n${recipe.description}`,
      });
    } catch {}
  }

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ChefHat size={40} color={theme.colors.neutral.light} />
        <Text style={styles.loadingText}>Loading Recipe...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* HERO IMAGE SECTION */}
        <View style={styles.heroContainer}>
          <View style={styles.placeholderImage}>
            <ChefHat size={80} color="rgba(255,255,255,0.2)" />
          </View>
          {/* Gradient-like Overlay */}
          <View style={styles.heroOverlay} />
        </View>

        {/* MAIN CONTENT SHEET */}
        <View style={styles.contentSheet}>
          {/* Header Info */}
          <View style={styles.headerInfo}>
            <View style={styles.pillContainer}>
              <Text style={styles.categoryPill}>{String(recipe.category || "General").toUpperCase()}</Text>
              {typeof (recipe as any).rating === "number" && (
                <View style={styles.ratingPill}>
                  <Text style={styles.ratingText}>★ {(recipe as any).rating}</Text>
                </View>
              )}
            </View>

            <Text style={styles.title}>{recipe.title}</Text>
            
            <View style={styles.creatorRow}>
               <Text style={styles.creatorLabel}>Created by</Text>
               <Text style={styles.creatorName}>{recipe.creator}</Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            <StatItem icon={<Clock size={20} color={theme.colors.primary.DEFAULT} />} label="Time" value={recipe.cookingTime} />
            <View style={styles.statDivider} />
            <StatItem icon={<Flame size={20} color="#F97316" />} label="Calories" value={recipe.calories || "-"} />
            <View style={styles.statDivider} />
            <StatItem icon={<Users size={20} color="#3B82F6" />} label="Servings" value="2 pp" />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Description</Text>
            <Text style={styles.descriptionText}>{recipe.description}</Text>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Ingredients <Text style={styles.countText}>({ingredients.length})</Text></Text>
            <View style={styles.ingredientsGrid}>
              {ingredients.map((ing, idx) => (
                <View key={`${idx}-${ing}`} style={styles.ingredientCard}>
                  <View style={styles.checkCircle}>
                    <CheckCircle2 size={16} color={theme.colors.primary.DEFAULT} />
                  </View>
                  <Text style={styles.ingredientText}>{ing}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Steps */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Instructions <Text style={styles.countText}>({steps.length})</Text></Text>
            <View style={styles.stepsContainer}>
              {steps.map((s, idx) => (
                <View key={`${idx}-${s}`} style={styles.stepRow}>
                  <View style={styles.stepIndicator}>
                    <Text style={styles.stepNumber}>{idx + 1}</Text>
                    {idx !== steps.length - 1 && <View style={styles.stepLine} />}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepText}>{s}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FLOATING HEADER (Back & Actions) */}
      <View style={[styles.floatingHeader, { top: insets.top }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButtonBlur}>
          <ArrowLeft size={22} color="white" />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButtonBlur} onPress={onShare}>
            <Share2 size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButtonBlur, isBookmarked && styles.activeBookmark]} 
            onPress={() => setIsBookmarked(!isBookmarked)}
          >
            <Heart size={20} color="white" fill={isBookmarked ? "white" : "transparent"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTTOM FLOATING ACTION BUTTON */}
      <View style={[styles.fabWrapper, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
        <TouchableOpacity 
          style={styles.fabButton} 
          onPress={() => router.push(`/cooking/${recipe.id}`)}
          activeOpacity={0.9}
        >
          <PlayCircle size={24} color="white" fill="white" stroke={theme.colors.primary.DEFAULT} />
          <Text style={styles.fabText}>Start Cooking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statIconWrapper}>{icon}</View>
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" }, // Background sangat muda
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 12, color: theme.colors.neutral.medium, fontFamily: theme.font.medium },

  // Hero Section
  heroContainer: { height: 380, width: "100%", backgroundColor: "#333" },
  placeholderImage: { 
    flex: 1, 
    backgroundColor: theme.colors.neutral.dark, // Dark background for contrast
    justifyContent: "center", 
    alignItems: "center" 
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  // Floating Header
  floatingHeader: {
    position: "absolute",
    left: 0, right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    zIndex: 50,
  },
  iconButtonBlur: {
    width: 44, height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(30,30,30,0.4)", // Glassmorphism-ish
    justifyContent: "center", alignItems: "center",
    backdropFilter: "blur(10px)", // Works on some versions/web
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerActions: { flexDirection: "row", gap: 12 },
  activeBookmark: { backgroundColor: theme.colors.primary.DEFAULT, borderColor: theme.colors.primary.DEFAULT },

  // Content Sheet
  contentSheet: {
    marginTop: -50,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 32,
    minHeight: 800,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  // Header Info
  headerInfo: { marginBottom: 24 },
  pillContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  categoryPill: {
    fontSize: 11, fontFamily: theme.font.bold, color: theme.colors.primary.DEFAULT,
    backgroundColor: theme.colors.primary.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, overflow: "hidden"
  },
  ratingPill: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF7ED", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  ratingText: { fontSize: 12, fontFamily: theme.font.bold, color: "#EA580C" },
  
  title: { fontSize: 28, fontFamily: theme.font.bold, color: theme.colors.neutral.dark, lineHeight: 34, marginBottom: 8 },
  creatorRow: { flexDirection: "row", alignItems: "center" },
  creatorLabel: { fontSize: 14, color: theme.colors.neutral.medium, marginRight: 4, fontFamily: theme.font.regular },
  creatorName: { fontSize: 14, color: theme.colors.neutral.dark, fontFamily: theme.font.bold },

  // Stats Grid
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 28,
  },
  statDivider: { width: 1, height: "80%", backgroundColor: "#E5E7EB", alignSelf: "center" },
  statItem: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, justifyContent: "center" },
  statIconWrapper: { },
  statLabel: { fontSize: 11, color: theme.colors.neutral.medium, fontFamily: theme.font.medium },
  statValue: { fontSize: 13, color: theme.colors.neutral.dark, fontFamily: theme.font.bold },

  // Common Sections
  section: { marginBottom: 32 },
  sectionHeader: { fontSize: 18, fontFamily: theme.font.bold, color: theme.colors.neutral.dark, marginBottom: 16 },
  countText: { color: theme.colors.neutral.medium, fontWeight: "normal" },
  descriptionText: { fontSize: 15, lineHeight: 24, color: theme.colors.neutral.medium, fontFamily: theme.font.regular },

  // Ingredients
  ingredientsGrid: { gap: 10 },
  ingredientCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1, borderColor: "#F3F4F6",
  },
  checkCircle: { marginRight: 12 },
  ingredientText: { fontSize: 15, color: theme.colors.neutral.dark, fontFamily: theme.font.medium },

  // Steps
  stepsContainer: { paddingLeft: 8 },
  stepRow: { flexDirection: "row", marginBottom: 0 },
  stepIndicator: { alignItems: "center", marginRight: 16, width: 30 },
  stepNumber: { 
    width: 28, height: 28, borderRadius: 14, 
    backgroundColor: theme.colors.primary.dark, 
    textAlign: "center", lineHeight: 28, 
    color: "white", fontSize: 12, fontFamily: theme.font.bold,
    zIndex: 2
  },
  stepLine: { width: 2, flex: 1, backgroundColor: "#E5E7EB", marginVertical: 4 },
  stepContent: { flex: 1, paddingBottom: 24 },
  stepText: { fontSize: 15, lineHeight: 24, color: theme.colors.neutral.dark, fontFamily: theme.font.regular, marginTop: 2 },

  // FAB
  fabWrapper: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24,
    backgroundColor: "transparent", 
  },
  fabButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: theme.colors.primary.DEFAULT,
    height: 56,
    borderRadius: 28,
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    gap: 10,
  },
  fabText: { fontSize: 16, fontFamily: theme.font.bold, color: "white" },
});