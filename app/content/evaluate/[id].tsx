import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContents } from '@/context/ContentContext';
import { resolveContentImage } from '@/utils/imageResolver';
import { colors, radius, spacing } from '@/theme';
import { Badge } from '@/components/ui/Badge';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScoreSelector } from '@/components/evaluation/ScoreSelector';
import { EvaluationCard } from '@/components/evaluation/EvaluationCard';

export default function EvaluateContentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getContentById, addEvaluation } = useContents();

  const [score, setScore] = useState<number>(10);
  const [comment, setComment] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const contentId = Number(id);
  const content = getContentById(contentId);

  if (!content) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyWrapper}>
          <EmptyState
            testID="evaluate-not-found"
            title="Conteúdo não encontrado"
            description="Não foi possível localizar o filme ou série para avaliação."
            actionLabel="Voltar ao Catálogo"
            onAction={() => router.replace('/')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const imageUri = resolveContentImage(content.image);

  const handlePublishEvaluation = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!comment.trim()) {
      setErrorMsg('Por favor, escreva um comentário sobre o conteúdo antes de enviar.');
      return;
    }

    addEvaluation(content.id, score, comment.trim());
    setComment('');
    setScore(10);
    setSuccessMsg('Avaliação publicada com sucesso! A média foi recalculada.');
  };

  const handleBackToDetails = () => {
    if (router.canGoBack && router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/content/${content.id}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} testID="evaluate-content-screen">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.summaryCard}>
          <Image
            source={{ uri: imageUri }}
            style={styles.posterThumb}
            resizeMode="cover"
          />
          <View style={styles.summaryInfo}>
            <View style={styles.summaryBadges}>
              <Badge contentType={content.type} />
              <RatingBadge
                rating={content.rating}
                count={content.evaluations.length}
                testID="evaluate-header-rating"
              />
            </View>
            <Text style={styles.contentTitle} testID="evaluate-content-title">
              {content.title}
            </Text>
            <Text style={styles.contentMeta}>
              {content.genre} • {content.releaseYear}
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Atribuir Nota e Comentário</Text>
          <Text style={styles.sectionSubtitle}>
            Compartilhe sua opinião sobre {content.title}
          </Text>

          {errorMsg && (
            <View style={styles.errorBanner} testID="evaluate-error-banner">
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {successMsg && (
            <View style={styles.successBanner} testID="evaluate-success-banner">
              <Text style={styles.successText}>{successMsg}</Text>
            </View>
          )}

          <ScoreSelector value={score} onChange={setScore} />

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Seu Comentário *</Text>
            <TextInput
              testID="evaluate-input-comment"
              value={comment}
              onChangeText={setComment}
              placeholder="Escreva o que você achou da história, direção, atuações..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          </View>

          <View style={styles.actionsRow}>
            <Button
              testID="evaluate-btn-back"
              title="Voltar aos Detalhes"
              onPress={handleBackToDetails}
              variant="secondary"
              style={styles.actionBtn}
            />
            <Button
              testID="evaluate-btn-submit"
              title="Publicar Avaliação"
              onPress={handlePublishEvaluation}
              variant="primary"
              style={styles.actionBtn}
            />
          </View>
        </View>

        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>
              Avaliações Existentes ({content.evaluations.length})
            </Text>
            <Text style={styles.averageSummary} testID="evaluate-average-summary">
              Média atual: ★ {content.rating > 0 ? content.rating.toFixed(1) : 'S/N'}
            </Text>
          </View>

          {content.evaluations.length === 0 ? (
            <EmptyState
              testID="evaluate-empty-history"
              title="Nenhuma avaliação registrada"
              description="Publique sua avaliação acima para inaugurar os comentários deste título!"
            />
          ) : (
            content.evaluations.map((ev, index) => (
              <EvaluationCard key={ev.id} evaluation={ev} index={index} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyWrapper: {
    padding: spacing.lg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.md,
    alignItems: 'center',
  },
  posterThumb: {
    width: 72,
    height: 102,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceElevated,
  },
  summaryInfo: {
    flex: 1,
    gap: 6,
  },
  summaryBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  contentTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  contentMeta: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  errorBanner: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  successBanner: {
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  successText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: '600',
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.xs + 2,
  },
  textArea: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.textPrimary,
    fontSize: 15,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    flex: 1,
  },
  historySection: {
    gap: spacing.sm,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  averageSummary: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
  },
});
