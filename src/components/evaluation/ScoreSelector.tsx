import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';

export interface ScoreSelectorProps {
  value: number;
  onChange: (score: number) => void;
}

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function getScoreSentiment(score: number): string {
  if (score >= 9) return 'Obra-prima';
  if (score >= 7) return 'Muito bom';
  if (score >= 5) return 'Regular';
  return 'Fraco';
}

export function ScoreSelector({ value, onChange }: ScoreSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Sua Nota (1 a 10)</Text>
        <Text style={styles.selectedInfo} testID="score-selector-current">
          ★ {value}/10 • {getScoreSentiment(value)}
        </Text>
      </View>

      <View style={styles.grid}>
        {SCORES.map((num) => {
          const isSelected = num === value;
          return (
            <TouchableOpacity
              key={num}
              testID={`score-option-${num}`}
              onPress={() => onChange(num)}
              style={[
                styles.scoreBtn,
                isSelected && styles.scoreBtnSelected,
              ]}
            >
              <Text
                style={[
                  styles.scoreText,
                  isSelected && styles.scoreTextSelected,
                ]}
              >
                {num}
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
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  selectedInfo: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  scoreBtn: {
    width: '18%',
    minWidth: 48,
    flexGrow: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBtnSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  scoreText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  scoreTextSelected: {
    color: '#0B0B0F',
    fontWeight: '900',
  },
});
