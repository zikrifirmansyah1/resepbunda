import { ArrowRight, ChefHat, Clock } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../theme';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={onPress}
      activeOpacity={0.9} // Sentuhan lebih responsif
    >
      {/* Top Row: Header & Time */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
          {recipe.isPrivate === 1 && (
            <View style={styles.privateBadge}>
              <Text style={styles.privateBadgeText}>PRIVATE</Text>
            </View>
          )}
        </View>
        
        <View style={styles.timeBadge}>
          <Clock size={12} color={theme.colors.neutral.medium} />
          <Text style={styles.timeText}>{recipe.cookingTime}</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {recipe.description}
      </Text>

      {/* Divider (Optional, kept subtle) */}
      <View style={styles.divider} />

      {/* Footer: Creator & Action */}
      <View style={styles.footerRow}>
        <View style={styles.creatorSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {recipe.creator.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.creatorName}>{recipe.creator}</Text>
            <View style={styles.creatorTypeWrapper}>
              <ChefHat size={10} color={theme.colors.primary.DEFAULT} />
              <Text style={styles.creatorType}>{recipe.creatorType}</Text>
            </View>
          </View>
        </View>

        {/* Modern Action Button */}
        <View style={styles.actionButton}>
          <ArrowRight size={18} color={theme.colors.primary.DEFAULT} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20, // Lebih bulat = lebih modern
    padding: 16,
    marginBottom: 16,
    // Soft Shadow (Elevation)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05, // Bayangan sangat halus
    shadowRadius: 12,
    elevation: 3, 
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)', // Border super tipis nyaris transparan
  },
  
  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 17,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
    lineHeight: 24, // Jarak antar baris judul lebih lega
  },
  privateBadge: {
    backgroundColor: '#FFF4E5', // Orange muda soft
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  privateBadgeText: {
    fontSize: 9,
    fontFamily: theme.font.bold,
    color: '#B45309', // Dark orange
    letterSpacing: 0.5,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // Light gray background
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: theme.font.medium,
    color: theme.colors.neutral.medium,
  },

  // Description
  description: {
    fontSize: 14,
    color: theme.colors.neutral.medium,
    lineHeight: 20,
    fontFamily: theme.font.regular,
    marginBottom: 16,
  },

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },

  // Footer
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creatorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary.bg, // Menggunakan warna tema soft
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: theme.font.bold,
    color: theme.colors.primary.DEFAULT,
    fontSize: 16,
  },
  creatorName: {
    fontSize: 13,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
  },
  creatorTypeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  creatorType: {
    fontSize: 11,
    color: theme.colors.neutral.medium,
    fontFamily: theme.font.medium,
  },

  // Tombol Panah (Action)
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    // Shadow kecil untuk tombol
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default RecipeCard;