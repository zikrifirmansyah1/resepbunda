import { Clock, Heart } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Alert, Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { getCategoryLabel } from '../constants/categories';
import { theme } from '../theme';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop';

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  const swipeableRef = useRef<Swipeable>(null);

  const addToFavorite = () => {
    Alert.alert(
      "Ditambahkan ke Favorit",
      `"${recipe.title}" telah ditambahkan ke daftar favorit kamu!`,
      [{ text: "OK" }]
    );
    swipeableRef.current?.close();
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.swipeAction}
        onPress={addToFavorite}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.swipeActionContent, { transform: [{ scale }] }]}>
          <Heart size={24} color={theme.colors.neutral.bg} fill={theme.colors.neutral.bg} />
          <Text style={styles.swipeActionText}>Favorit</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}
    >
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={onPress}
        activeOpacity={0.98}
      >
        {/* Image Thumbnail */}
        <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.image || DEFAULT_IMAGE }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {recipe.title || 'Untitled'}
        </Text>
        
        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description || 'Tidak ada deskripsi'}
        </Text>

        {/* Author */}
        <Text style={styles.author}>
          Oleh {recipe.creator || 'Anonymous'}
        </Text>

        {/* Footer: Time & Category */}
        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Clock size={14} color={theme.colors.neutral.medium} />
            <Text style={styles.timeText}>{recipe.cookingTime || '- mnt'}</Text>
          </View>
          
          <View style={styles.dot} />
          
          <Text style={styles.category}>{getCategoryLabel(recipe.category)}</Text>
        </View>
      </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    gap: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },
  
  imageContainer: {
    width: 96,
    height: 96,
    borderRadius: theme.radius.sm,
    overflow: 'hidden',
    backgroundColor: theme.colors.neutral.light,
  },
  
  image: {
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
    minHeight: 96,
    paddingVertical: 2,
  },

  title: {
    fontSize: 16,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
    lineHeight: 22,
    marginBottom: 4,
  },

  description: {
    fontSize: 12,
    color: theme.colors.neutral.medium,
    lineHeight: 18,
    fontFamily: theme.font.regular,
    marginBottom: 4,
  },

  author: {
    fontSize: 11,
    fontFamily: theme.font.semibold,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing.xs,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },

  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  timeText: {
    fontSize: 12,
    fontFamily: theme.font.medium,
    color: theme.colors.neutral.medium,
  },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.neutral.light,
    marginHorizontal: 10,
  },

  category: {
    fontSize: 12,
    fontFamily: theme.font.medium,
    color: theme.colors.neutral.medium,
  },

  swipeAction: {
    backgroundColor: theme.colors.danger.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: theme.radius.md,
    marginLeft: theme.spacing.xs,
  },

  swipeActionContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  swipeActionText: {
    color: theme.colors.neutral.bg,
    fontSize: 11,
    fontFamily: theme.font.semibold,
  },
});

export default RecipeCard;
