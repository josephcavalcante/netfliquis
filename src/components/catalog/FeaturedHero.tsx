import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Content } from '@/types/content';
import { colors, radius, spacing } from '@/theme';
import { resolveContentImage } from '@/utils/imageResolver';
import { formatDuration, formatSeriesInfo } from '@/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { Button } from '@/components/ui/Button';

export interface FeaturedHeroProps {
  content: Content;
  onPressDetails: (id: number) => void;
  onPressEvaluate: (id: number) => void;
}

export function FeaturedHero({
  content,
  onPressDetails,
  onPressEvaluate,
}: FeaturedHeroProps) {
  const imageUri = resolveContentImage(content.image);
  const specificMeta =
    content.type === 'movie'
      ? formatDuration(content.duration)
      : formatSeriesInfo(content.seasons, content.episodes);

  return (
    <View style={styles.container} testID="featured-hero">
      <Image source={{ uri: imageUri }} style={styles.backgroundImage} resizeMode="cover" />
      <View style={styles.overlay}>
        <View style={styles.topRow}>
          <View style={styles.badgeGroup}>
            <Badge label="EM DESTAQUE" />
            <Badge contentType={content.type} />
          </View>
          <RatingBadge rating={content.rating} count={content.evaluations.length} />
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {content.title}
        </Text>

        <Text style={styles.metaText}>
          {content.genre} • {content.releaseYear} • {specificMeta}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {content.description}
        </Text>

        <View style={styles.actions}>
          <Button
            testID="hero-details-btn"
            title="Ver Detalhes"
            onPress={() => onPressDetails(content.id)}
            variant="primary"
            size="sm"
            style={styles.actionBtn}
          />
          <Button
            testID="hero-evaluate-btn"
            title="★ Avaliar"
            onPress={() => onPressEvaluate(content.id)}
            variant="secondary"
            size="sm"
            style={styles.actionBtn}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    minHeight: 240,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.35,
  },
  overlay: {
    padding: spacing.lg,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(11, 11, 15, 0.55)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeGroup: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  metaText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
});
