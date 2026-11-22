import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Evaluation } from '@/types/content';
import { colors, radius, spacing } from '@/theme';
import { formatDate } from '@/utils/formatters';

export interface EvaluationCardProps {
  evaluation: Evaluation;
  index?: number;
}

export function EvaluationCard({ evaluation, index }: EvaluationCardProps) {
  return (
    <View style={styles.card} testID={`evaluation-card-${evaluation.id}`}>
      <View style={styles.header}>
        <View style={styles.scoreBadge}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.scoreText} testID={`evaluation-score-${evaluation.id}`}>
            {evaluation.score}/10
          </Text>
        </View>
        <Text style={styles.dateText}>
          {index !== undefined ? `Avaliação #${evaluation.id} • ` : ''}
          {formatDate(evaluation.createdAt)}
        </Text>
      </View>

      <Text style={styles.commentText} testID={`evaluation-comment-${evaluation.id}`}>
        {evaluation.comment}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
    gap: 4,
  },
  star: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  scoreText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  commentText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
