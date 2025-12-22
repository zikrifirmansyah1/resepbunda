import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { ChefHat, Search, SlidersHorizontal } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FilterModal, { SortOption } from "../../src/components/FilterModal";
import RecipeCard from "../../src/components/RecipeCard";
import { querySql } from "../../src/services/db";
import { theme } from "../../src/theme";
import type { Recipe } from "../../src/types/recipe";

const categories = [
  { id: "all", name: "All" },
  { id: "special", name: "Special" },
  { id: "healthy", name: "Healthy" },
  { id: "dessert", name: "Dessert" },
  { id: "traditional", name: "Traditional" },
];

const parseNumber = (str: string) => parseInt(String(str).replace(/\D/g, "")) || 0;

export default function HomeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [userName, setUserName] = useState("Chef"); // Default fallback name
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 1. Fetch Recipes & User Profile
  const fetchData = async () => {
    try {
      // Ambil data resep
      const recipeResult = await querySql<Recipe>(
        "SELECT * FROM recipes WHERE isPrivate = 0 ORDER BY COALESCE(rating, 0) DESC, id DESC"
      );
      setRecipes(recipeResult);

      // Ambil nama user yang sedang login
      // Kita JOIN session dengan users berdasarkan email
      const userResult = await querySql<{ fullName: string }>(`
        SELECT u.fullName 
        FROM session s
        JOIN users u ON s.email = u.email
        WHERE s.id = 1
      `);
      
      if (userResult.length > 0 && userResult[0].fullName) {
        // Ambil kata pertama saja agar tidak terlalu panjang di header
        const firstName = userResult[0].fullName.split(" ")[0];
        setUserName(firstName);
      }
    } catch (e) {
      console.error("Failed to fetch data", e);
      setRecipes([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  // 2. Filter Logic
  const filteredAndSortedRecipes = useMemo(() => {
    let result = recipes.filter((recipe) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
      if (!q) return matchesCategory;

      const title = String(recipe.title ?? "").toLowerCase();
      const category = String(recipe.category ?? "").toLowerCase();
      return matchesCategory && (title.includes(q) || category.includes(q));
    });

    if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "time") {
      result = [...result].sort((a, b) => parseNumber(a.cookingTime) - parseNumber(b.cookingTime));
    } else if (sortBy === "calories") {
      result = [...result].sort((a, b) => parseNumber(a.calories || "0") - parseNumber(b.calories || "0"));
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy, recipes]);

  const handleApplyFilter = (newSortBy: SortOption, newCategory: string) => {
    setSortBy(newSortBy);
    setSelectedCategory(newCategory);
  };

  const handleRecipePress = (recipeId: number) => {
    router.push(`/recipe/${recipeId}`);
  };

  // 3. Render Header Component
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Greeting Section */}
      <View style={styles.greetingSection}>
        <View>
          <Text style={styles.greetingText}>
            Hi, <Text style={styles.userNameText}>{userName}</Text> 👋
          </Text>
          <Text style={styles.subGreetingText}>What do you want to cook today?</Text>
        </View>
      </View>

      {/* Search Bar - Floating Style */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={theme.colors.neutral.medium} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            placeholderTextColor={theme.colors.neutral.medium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.8}
        >
          <SlidersHorizontal size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.categoryScrollContent}
        style={styles.categoryScroll}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                isActive ? styles.categoryChipActive : styles.categoryChipInactive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text 
                style={[
                  styles.categoryText, 
                  isActive ? styles.categoryTextActive : styles.categoryTextInactive
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Section Title (Optional, adds structure) */}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? "Search Results" : "Fresh Recipes"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <FlatList
        data={filteredAndSortedRecipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
             <RecipeCard recipe={item} onPress={() => handleRecipePress(item.id)} />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <ChefHat size={40} color={theme.colors.neutral.medium} />
            </View>
            <Text style={styles.emptyTitle}>No Recipes Found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
          </View>
        }
      />

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilter}
        initialSortBy={sortBy}
        initialCategory={selectedCategory}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB", // Very light gray background for elegance
  },
  listContent: {
    paddingBottom: 30,
  },
  cardWrapper: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: 4, // Space between cards handled by the card itself mostly
  },
  
  // Header Styles
  headerContainer: {
    backgroundColor: "transparent",
    marginBottom: 4,
  },
  greetingSection: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 26,
    fontFamily: theme.font.regular,
    color: theme.colors.neutral.dark,
    marginBottom: 4,
  },
  userNameText: {
    fontFamily: theme.font.bold,
    color: theme.colors.primary.DEFAULT,
  },
  subGreetingText: {
    fontSize: 15,
    fontFamily: theme.font.regular,
    color: theme.colors.neutral.medium,
    letterSpacing: 0.3,
  },

  // Search Section
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    marginBottom: 24,
    alignItems: "center",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    height: 50,
    // Elegant soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    marginLeft: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    fontFamily: theme.font.medium,
    color: theme.colors.neutral.dark,
    paddingRight: 16,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: theme.colors.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
    // Button shadow
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  // Categories
  categoryScroll: {
    marginBottom: 24,
  },
  categoryScrollContent: {
    paddingHorizontal: theme.spacing.md,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryChipInactive: {
    backgroundColor: "#FFFFFF", // White background for inactive
    borderWidth: 1,
    borderColor: "#E5E7EB", // Very light border
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderWidth: 1,
    borderColor: theme.colors.primary.DEFAULT,
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: theme.font.medium,
  },
  categoryTextInactive: {
    color: theme.colors.neutral.medium,
  },
  categoryTextActive: {
    color: "#FFFFFF",
    fontFamily: theme.font.bold,
  },

  // Section Title
  sectionTitleContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.colors.neutral.medium,
  },
});