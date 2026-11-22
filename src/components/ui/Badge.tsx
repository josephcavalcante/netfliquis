import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ContentType } from '@/types/content';
import { colors, radius, spacing } from '@/theme';
import { formatContentTypeLabel } from '@/utils/formatters';

export interface BadgeProps {
  label?: string;
  contentType?: ContentType;
  variant?: 'default' | 'movie' | 'series' | 'outline';
  testID?: string;
}

export function Badge({ label, contentType, variant = 'default', testID }: BadgeProps) {
  const effectiveVariant = contentType ? contentType : variant;
  const textLabel = contentType ? formatContentTypeLabel(contentType) : label || '';

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        effectiveVariant === 'movie' && styles.movieContainer,
        effectiveVariant === 'series' && styles.seriesContainer,
        effectiveVariant === 'outline' && styles.outlineContainer,
      ]}
    >
      <Text
        style={[
          styles.text,
          effectiveVariant === 'movie' && styles.movieText,
          effectiveVariant === 'series' && styles.seriesText,
          effectiveVariant === 'outline' && styles.outlineText,
        ]}
      >
        {textLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
    alignSelf: 'flex-start',
  },
  movieContainer: {
    backgroundColor: colors.badgeMovie,
  },
  seriesContainer: {
    backgroundColor: colors.badgeSeries,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  movieText: {
    color: '#FFFFFF',
  },
  seriesText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: colors.textSecondary,
    textTransform: 'none',
  },
});
