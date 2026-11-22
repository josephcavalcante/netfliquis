import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContents } from '@/context/ContentContext';
import { resolveContentImage } from '@/utils/imageResolver';
import {
  formatDate,
  formatDuration,
  formatSeriesInfo,
} from '@/utils/formatters';
import { colors, radius, spacing } from '@/theme';
import { Badge } from '@/components/ui/Badge';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EvaluationCard } from '@/components/evaluation/EvaluationCard';

export default function ContentDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getContentById, deleteContent } = useContents();
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const contentId = Number(id);
  const content = getContentById(contentId);

  if (!content) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyWrapper}>
          <EmptyState
            testID="details-not-found"
            title="Conteúdo não encontrado"
            description="Este título pode ter sido excluído ou o identificador não existe."
            actionLabel="Voltar ao Catálogo"
            onAction={() => router.replace('/')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const imageUri = resolveContentImage(content.image);
  const specificCharacteristic =
    content.type === 'movie'
      ? formatDuration(content.duration)
      : formatSeriesInfo(content.seasons, content.episodes);

  const handleConfirmDelete = () => {
    setConfirmDeleteVisible(false);
    deleteContent(content.id);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea} testID="details-content-screen">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Image
            source={{ uri: imageUri }}
            style={styles.posterImage}
            resizeMode="cover"
          />
          <View style={styles.heroContent}>
            <View style={styles.badgeRow}>
              <Badge contentType={content.type} testID="details-type-badge" />
              <Badge label={content.genre} variant="outline" />
              <RatingBadge
                rating={content.rating}
                count={content.evaluations.length}
                size="lg"
                testID="details-rating-badge"
              />
            </View>

            <Text style={styles.title} testID="details-title">
              {content.title}
            </Text>

            <View style={styles.metaGrid}>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>ANO DE LANÇAMENTO</Text>
                <Text style={styles.metaValue} testID="details-release-year">
                  {content.releaseYear}
                </Text>
              </View>

              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>
                  {content.type === 'movie' ? 'DURAÇÃO DO FILME' : 'TEMPORADAS E EPISÓDIOS'}
                </Text>
                <Text style={styles.metaValue} testID="details-specific-meta">
                  {specificCharacteristic}
                </Text>
              </View>

              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>MÉDIA DAS AVALIAÇÕES</Text>
                <Text style={styles.metaValueAccent} testID="details-average-score">
                  ★ {content.rating > 0 ? `${content.rating.toFixed(1)} / 10` : 'Sem avaliações'}
                </Text>
              </View>

              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>CADASTRADO EM</Text>
                <Text style={styles.metaValue}>{formatDate(content.createdAt)}</Text>
              </View>
            </View>

            <View style={styles.synopsisSection}>
              <Text style={styles.sectionHeading}>Sinopse</Text>
              <Text style={styles.description} testID="details-description">
                {content.description}
              </Text>
            </View>

            <View style={styles.actionsBar}>
              <Button
                testID="details-btn-evaluate"
                title="★ Avaliar Conteúdo"
                onPress={() => router.push(`/content/evaluate/${content.id}`)}
                variant="primary"
                style={styles.primaryAction}
              />
              <View style={styles.secondaryActions}>
                <Button
                  testID="details-btn-edit"
                  title="Editar"
                  onPress={() => router.push(`/content/edit/${content.id}`)}
                  variant="secondary"
                  style={styles.halfAction}
                />
                <Button
                  testID="details-btn-delete"
                  title="Excluir"
                  onPress={() => setConfirmDeleteVisible(true)}
                  variant="danger"
                  style={styles.halfAction}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.evaluationsSection}>
          <View style={styles.evalHeaderRow}>
            <View>
              <Text style={styles.sectionHeading}>
                Avaliações e Comentários ({content.evaluations.length})
              </Text>
              <Text style={styles.evalSubheading}>
                Opiniões compartilhadas pelos usuários
              </Text>
            </View>
            <Button
              testID="details-btn-add-eval-small"
              title="+ Avaliar"
              onPress={() => router.push(`/content/evaluate/${content.id}`)}
              variant="secondary"
              size="sm"
            />
          </View>

          {content.evaluations.length === 0 ? (
            <EmptyState
              testID="details-empty-evaluations"
              title="Nenhuma avaliação ainda"
              description="Seja o primeiro a atribuir uma nota e escrever um comentário sobre este conteúdo."
              actionLabel="Avaliar Agora"
              onAction={() => router.push(`/content/evaluate/${content.id}`)}
            />
          ) : (
            content.evaluations.map((ev, index) => (
              <EvaluationCard key={ev.id} evaluation={ev} index={index} />
            ))
          )}
        </View>
      </ScrollView>

      <ConfirmModal
        visible={confirmDeleteVisible}
        title="Excluir Conteúdo"
        message={`Tem certeza que deseja excluir "${content.title}" do catálogo? Esta ação removerá o registro da memória.`}
        confirmLabel="Sim, Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteVisible(false)}
      />
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
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  posterImage: {
    width: '100%',
    height: 260,
    backgroundColor: colors.surfaceElevated,
  },
  heroContent: {
    padding: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '900',
    marginBottom: spacing.lg,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metaBox: {
    flexGrow: 1,
    minWidth: '45%',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  metaValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  metaValueAccent: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
  },
  synopsisSection: {
    marginBottom: spacing.xl,
  },
  sectionHeading: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },
  actionsBar: {
    gap: spacing.sm,
  },
  primaryAction: {
    width: '100%',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfAction: {
    flex: 1,
  },
  evaluationsSection: {
    gap: spacing.sm,
  },
  evalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  evalSubheading: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
