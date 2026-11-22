import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import { formatRating } from '@/utils/formatters';

export interface RatingBadgeProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  testID?: string;
}

export function RatingBadge({ rating, count, size = 'md', testID }: RatingBadgeProps) {
  return (
    <View
      testID={testID}
      style={[
        styles.container,
        size === 'sm' && styles.containerSm,
        size === 'lg' && styles.containerLg,
      ]}
    >
      <Text style={[styles.star, size === 'lg' && styles.starLg]}>★</Text>
      <Text style={[styles.ratingText, size === 'lg' && styles.ratingTextLg]}>
        {formatRating(rating)}
      </Text>
      {typeof count === 'number' && (
        <Text style={styles.countText}>({count})</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 22, 30, 0.92)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(245, 197, 24, 0.35)',
    alignSelf: 'flex-start',
    gap: 4,
  },
  containerSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  containerLg: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  star: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  starLg: {
    fontSize: 16,
  },
  ratingText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  ratingTextLg: {
    fontSize: 16,
    fontWeight: '800',
  },
  countText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
});
