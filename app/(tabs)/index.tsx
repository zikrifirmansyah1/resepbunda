import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Search, SlidersHorizontal, ChefHat } from 'lucide-react-native';
import { Recipe } from '../../src/types/recipe';
import { querySql } from '../../src/services/db/client';
import RecipeCard from '../../src/components/RecipeCard';
import FilterModal, { SortOption } from '../../src/components/FilterModal';
import { theme } from '../../src/theme';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'special', name: 'Special' },
  { id: 'healthy', name: 'Healthy' },
  { id: 'dessert', name: 'Dessert' },
  { id: 'traditional', name: 'Traditional' },
];

// Helper untuk parsing angka dari string (misal: "45 min" -> 45)
const parseNumber = (str: string) => parseInt(str.replace(/\D/g, '')) || 0;

const HomeScreen = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State untuk modal dan filter
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchRecipes = async () => {
    try {
      // Ambil HANYA resep publik untuk feed utama
      const result = await querySql<Recipe>('SELECT * FROM recipes WHERE isPrivate = 0');
      setRecipes(result);
    } catch (e) {
      console.error('Failed to fetch recipes', e);
    }
  };

  useFocusEffect(useCallback(() => { fetchRecipes(); }, []));

  const filteredAndSortedRecipes = useMemo(() => {
    let result = recipes.filter(recipe => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      
      // Logika Filter yang Diperbarui
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      const matchesSearch = 
        recipe.title.toLowerCase().includes(lowerCaseQuery) ||
        recipe.category.toLowerCase().includes(lowerCaseQuery); // Mencari di kategori juga

      return matchesCategory && matchesSearch;
    });

    // Terapkan sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'time') {
      result.sort((a, b) => parseNumber(a.cookingTime) - parseNumber(b.cookingTime));
    } else if (sortBy === 'calories') {
      result.sort((a, b) => parseNumber(a.calories || '0') - parseNumber(b.calories || '0'));
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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerText}>
        <Text style={styles.greeting}>Hi, Saimon Fang</Text>
        <Text style={styles.subGreeting}>What do you want to cook today?</Text>
      </View>
      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Search size={18} color={theme.colors.neutral.medium} style={{ marginLeft: 16 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes or categories..." // Placeholder diperbarui
            placeholderTextColor={theme.colors.neutral.medium}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <SlidersHorizontal size={20} color={'white'} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryChip, selectedCategory === category.id && styles.selectedCategoryChip]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={[styles.categoryText, selectedCategory === category.id && styles.selectedCategoryText]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.neutral.bg}}>
      <FlatList
        data={filteredAndSortedRecipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <RecipeCard
            recipe={item}
            onPress={() => handleRecipePress(item.id)}
            />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContentContainer}
        style={styles.container}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
            <ChefHat size={48} color={theme.colors.neutral.light} />
            <Text style={styles.emptyText}>No recipes found.</Text>
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
};

// Styles tetap sama
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.bg,
  },
  listContentContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 24,
  },
  headerContainer: {
    paddingBottom: theme.spacing.sm,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
    marginBottom: theme.spacing.md,
  },
  headerText: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  greeting: {
    fontSize: 24,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
  },
  subGreeting: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.colors.neutral.medium,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.bg,
    borderRadius: theme.radius.pill,
    height: 44,
    borderColor: theme.colors.neutral.light,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: theme.spacing.sm,
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.colors.neutral.dark,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.primary.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    elevation: 4,
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  categoryScroll: {
    paddingHorizontal: theme.spacing.md,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.neutral.bg,
    borderColor: theme.colors.neutral.light,
    borderWidth: 1,
    marginRight: theme.spacing.sm,
    height: 40,
  },
  selectedCategoryChip: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderColor: theme.colors.primary.dark,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: theme.font.medium,
    color: theme.colors.neutral.medium,
  },
  selectedCategoryText: {
    color: 'white',
    fontFamily: theme.font.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: theme.font.semibold,
    color: theme.colors.neutral.medium,
  },
});

export default HomeScreen;