import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ContentFilterType } from '@/types/content';
import { colors, radius, spacing } from '@/theme';

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedType: ContentFilterType;
  onSelectType: (type: ContentFilterType) => void;
  counts: {
    all: number;
    movie: number;
    series: number;
  };
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedType,
  onSelectType,
  counts,
}: FilterBarProps) {
  const tabs: { key: ContentFilterType; label: string; count: number }[] = [
    { key: 'all', label: 'Todos', count: counts.all },
    { key: 'movie', label: 'Filmes', count: counts.movie },
    { key: 'series', label: 'Séries', count: counts.series },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          testID="catalog-search-input"
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Buscar por título, gênero ou ano..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            testID="catalog-search-clear"
            onPress={() => onSearchChange('')}
            style={styles.clearBtn}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = selectedType === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              testID={`filter-tab-${tab.key}`}
              onPress={() => onSelectType(tab.key)}
              style={[styles.tab, isActive && styles.tabActive]}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab.label} ({tab.count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    paddingVertical: spacing.md,
  },
  clearBtn: {
    padding: spacing.xs,
  },
  clearText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
});
