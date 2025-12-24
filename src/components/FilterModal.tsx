import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { CATEGORIES } from '../constants/categories';
import { theme } from '../theme';

// Mendefinisikan tipe untuk opsi sorting dan props
export type SortOption = 'recommended' | 'rating' | 'time' | 'calories';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (sortBy: SortOption, category: string) => void;
  initialSortBy: SortOption;
  initialCategory: string;
}

const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'rating', label: 'Highest Rating' },
    { id: 'time', label: 'Fastest Time' },
    { id: 'calories', label: 'Lowest Calories' },
];

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply, initialSortBy, initialCategory }) => {
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Reset state internal saat props berubah (misal, saat modal dibuka kembali)
  useEffect(() => {
    setSortBy(initialSortBy);
    setSelectedCategory(initialCategory);
  }, [visible, initialSortBy, initialCategory]);

  const handleApply = () => {
    onApply(sortBy, selectedCategory);
    onClose();
  };

  const handleReset = () => {
    setSortBy('recommended');
    setSelectedCategory('all');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Search</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.neutral.medium} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.optionsContainer}>
            {sortOptions.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setSortBy(opt.id)}
                style={[styles.optionChip, sortBy === opt.id && styles.selectedOptionChip]}
              >
                <Text style={[styles.optionText, sortBy === opt.id && styles.selectedOptionText]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.optionsContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[styles.optionChip, selectedCategory === cat.id && styles.selectedOptionChip]}
              >
                <Text style={[styles.optionText, selectedCategory === cat.id && styles.selectedOptionText]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.dark,
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.font.semibold,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  optionChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.neutral.bg,
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
  },
  selectedOptionChip: {
    backgroundColor: theme.colors.primary.bg,
    borderColor: theme.colors.primary.light,
  },
  optionText: {
    fontSize: 14,
    fontFamily: theme.font.medium,
    color: theme.colors.neutral.medium,
  },
  selectedOptionText: {
    color: theme.colors.primary.dark,
    fontFamily: theme.font.semibold,
  },
  footer: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  resetButton: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.light,
    borderRadius: theme.radius.md,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: theme.font.bold,
    color: theme.colors.neutral.medium,
  },
  applyButton: {
    flex: 2,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radius.md,
    elevation: 2,
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 2}
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: theme.font.bold,
    color: 'white',
  },
});

export default FilterModal;