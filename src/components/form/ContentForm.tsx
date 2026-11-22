import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ContentFormInput, ContentType } from '@/types/content';
import { GENRE_SUGGESTIONS } from '@/data/initialContents';
import { PRESET_COVERS, resolveContentImage } from '@/utils/imageResolver';
import { colors, radius, spacing } from '@/theme';
import { Button } from '@/components/ui/Button';

export interface ContentFormProps {
  mode: 'create' | 'edit';
  initialValues?: ContentFormInput;
  onSubmit: (data: ContentFormInput) => void;
  onCancel: () => void;
}

export function ContentForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
}: ContentFormProps) {
  const [type, setType] = useState<ContentType>(initialValues?.type ?? 'movie');
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [genre, setGenre] = useState(initialValues?.genre ?? 'Ficção científica');
  const [releaseYear, setReleaseYear] = useState(
    initialValues?.releaseYear ? String(initialValues.releaseYear) : '2026'
  );
  const [duration, setDuration] = useState(
    initialValues?.duration ? String(initialValues.duration) : '120'
  );
  const [seasons, setSeasons] = useState(
    initialValues?.seasons ? String(initialValues.seasons) : '1'
  );
  const [episodes, setEpisodes] = useState(
    initialValues?.episodes ? String(initialValues.episodes) : '10'
  );
  const [image, setImage] = useState(
    initialValues?.image ?? '/images/interestelar.jpg'
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = () => {
    setErrorMsg(null);

    if (!title.trim()) {
      setErrorMsg('Por favor, informe o título do conteúdo.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Por favor, informe a descrição/sinopse do conteúdo.');
      return;
    }

    if (!genre.trim()) {
      setErrorMsg('Por favor, informe o gênero do conteúdo.');
      return;
    }

    const parsedYear = Number(releaseYear);
    if (!parsedYear || parsedYear < 1888 || parsedYear > 2100) {
      setErrorMsg('Informe um ano de lançamento válido (entre 1888 e 2100).');
      return;
    }

    if (type === 'movie') {
      const parsedDuration = Number(duration);
      if (!parsedDuration || parsedDuration <= 0) {
        setErrorMsg('Informe a duração do filme em minutos (maior que zero).');
        return;
      }

      onSubmit({
        type: 'movie',
        title: title.trim(),
        description: description.trim(),
        genre: genre.trim(),
        releaseYear: parsedYear,
        duration: parsedDuration,
        image: image.trim() || '/images/interestelar.jpg',
      });
      return;
    }

    const parsedSeasons = Number(seasons);
    const parsedEpisodes = Number(episodes);
    if (!parsedSeasons || parsedSeasons <= 0 || !parsedEpisodes || parsedEpisodes <= 0) {
      setErrorMsg('Informe a quantidade de temporadas e episódios (maiores que zero).');
      return;
    }

    onSubmit({
      type: 'series',
      title: title.trim(),
      description: description.trim(),
      genre: genre.trim(),
      releaseYear: parsedYear,
      seasons: parsedSeasons,
      episodes: parsedEpisodes,
      image: image.trim() || '/images/stranger-things.jpg',
    });
  };

  const previewUri = resolveContentImage(image);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.sectionLabel}>1. Tipo de Conteúdo</Text>
      <View style={styles.typeSelectorRow}>
        <TouchableOpacity
          testID="form-type-movie"
          onPress={() => setType('movie')}
          style={[
            styles.typeOption,
            type === 'movie' && styles.typeOptionMovieActive,
          ]}
        >
          <Text
            style={[
              styles.typeOptionText,
              type === 'movie' && styles.typeOptionTextActive,
            ]}
          >
            🎬 Filme
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="form-type-series"
          onPress={() => setType('series')}
          style={[
            styles.typeOption,
            type === 'series' && styles.typeOptionSeriesActive,
          ]}
        >
          <Text
            style={[
              styles.typeOptionText,
              type === 'series' && styles.typeOptionTextActive,
            ]}
          >
            📺 Série
          </Text>
        </TouchableOpacity>
      </View>

      {errorMsg && (
        <View style={styles.errorBanner} testID="form-error-banner">
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          testID="form-input-title"
          value={title}
          onChangeText={setTitle}
          placeholder="Ex: Interestelar ou Stranger Things"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Descrição / Sinopse *</Text>
        <TextInput
          testID="form-input-description"
          value={description}
          onChangeText={setDescription}
          placeholder="Descreva a história principal do filme ou série..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Gênero *</Text>
        <TextInput
          testID="form-input-genre"
          value={genre}
          onChangeText={setGenre}
          placeholder="Ex: Ficção científica, Suspense, Drama..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsRow}
        >
          {GENRE_SUGGESTIONS.map((g) => {
            const active = genre.toLowerCase() === g.toLowerCase();
            return (
              <TouchableOpacity
                key={g}
                testID={`genre-chip-${g}`}
                onPress={() => setGenre(g)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.rowFields}>
        <View style={[styles.fieldGroup, styles.halfField]}>
          <Text style={styles.label}>Ano de Lançamento *</Text>
          <TextInput
            testID="form-input-year"
            value={releaseYear}
            onChangeText={setReleaseYear}
            keyboardType="numeric"
            placeholder="2024"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>

        {type === 'movie' ? (
          <View style={[styles.fieldGroup, styles.halfField]}>
            <Text style={styles.label}>Duração (minutos) *</Text>
            <TextInput
              testID="form-input-duration"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              placeholder="169"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
          </View>
        ) : (
          <>
            <View style={[styles.fieldGroup, styles.quarterField]}>
              <Text style={styles.label}>Temporadas *</Text>
              <TextInput
                testID="form-input-seasons"
                value={seasons}
                onChangeText={setSeasons}
                keyboardType="numeric"
                placeholder="4"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
            <View style={[styles.fieldGroup, styles.quarterField]}>
              <Text style={styles.label}>Episódios *</Text>
              <TextInput
                testID="form-input-episodes"
                value={episodes}
                onChangeText={setEpisodes}
                keyboardType="numeric"
                placeholder="34"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </View>
          </>
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Imagem de Capa (Caminho ou URL) *</Text>
        <TextInput
          testID="form-input-image"
          value={image}
          onChangeText={setImage}
          placeholder="/images/interestelar.jpg ou https://..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <Text style={styles.helperLabel}>Ou selecione uma capa rápida:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsRow}
        >
          {PRESET_COVERS.map((preset) => {
            const selected = image === preset.path;
            return (
              <TouchableOpacity
                key={preset.path}
                testID={`preset-cover-${preset.path}`}
                onPress={() => setImage(preset.path)}
                style={[styles.chip, selected && styles.chipActive]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.previewCard}>
          <Image
            source={{ uri: previewUri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <View style={styles.previewMeta}>
            <Text style={styles.previewBadge}>PREVIEW DA CAPA</Text>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {title.trim() || 'Título do Conteúdo'}
            </Text>
            <Text style={styles.previewSub} numberOfLines={1}>
              {genre || 'Gênero'} • {releaseYear || 'Ano'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footerActions}>
        <Button
          testID="form-cancel-btn"
          title="Cancelar"
          onPress={onCancel}
          variant="secondary"
          style={styles.footerBtn}
        />
        <Button
          testID="form-submit-btn"
          title={mode === 'create' ? 'Cadastrar Conteúdo' : 'Salvar Alterações'}
          onPress={handleSubmit}
          variant="primary"
          style={styles.footerBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  sectionLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  typeOption: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeOptionMovieActive: {
    backgroundColor: colors.badgeMovie,
    borderColor: colors.badgeMovie,
  },
  typeOptionSeriesActive: {
    backgroundColor: colors.badgeSeries,
    borderColor: colors.badgeSeries,
  },
  typeOptionText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  typeOptionTextActive: {
    color: colors.textPrimary,
  },
  errorBanner: {
    backgroundColor: colors.dangerBg,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
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
  helperLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    color: colors.textPrimary,
    fontSize: 15,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  chipsScroll: {
    marginTop: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
  chip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.textPrimary,
  },
  rowFields: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfField: {
    flex: 2,
  },
  quarterField: {
    flex: 1,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginTop: spacing.md,
    gap: spacing.md,
  },
  previewImage: {
    width: 60,
    height: 84,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceElevated,
  },
  previewMeta: {
    flex: 1,
    gap: 4,
  },
  previewBadge: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  previewTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  previewSub: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  footerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  footerBtn: {
    flex: 1,
  },
});
