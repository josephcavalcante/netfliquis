import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Content } from '@/types/content';
import { colors, radius, spacing } from '@/theme';
import { resolveContentImage } from '@/utils/imageResolver';
import { Badge } from '@/components/ui/Badge';
import { RatingBadge } from '@/components/ui/RatingBadge';

export interface ContentCardProps {
  content: Content;
  onPress: (id: number) => void;
}

export function ContentCard({ content, onPress }: ContentCardProps) {
  const imageUri = resolveContentImage(content.image);
  const subDetail =
    content.type === 'movie'
      ? `${content.duration || 0} min`
      : `${content.seasons || 1} temp • ${content.episodes || 1} ep`;

  return (
    <TouchableOpacity
      testID={`content-card-${content.id}`}
      activeOpacity={0.85}
      onPress={() => onPress(content.id)}
      style={styles.card}
    >
      <View style={styles.posterContainer}>
        <Image source={{ uri: imageUri }} style={styles.poster} resizeMode="cover" />
        <View style={styles.topBadges}>
          <Badge contentType={content.type} testID={`card-type-badge-${content.id}`} />
          <RatingBadge
            rating={content.rating}
            size="sm"
            testID={`card-rating-badge-${content.id}`}
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1} testID={`card-title-${content.id}`}>
          {content.title}
        </Text>
        <Text style={styles.genreYear} numberOfLines={1}>
          {content.genre} • {content.releaseYear}
        </Text>
        <Text style={styles.specificMeta} numberOfLines={1}>
          {subDetail}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  posterContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceElevated,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  topBadges: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    padding: spacing.md,
    gap: 3,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  genreYear: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  specificMeta: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
