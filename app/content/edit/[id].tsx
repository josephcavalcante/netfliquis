import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContents } from '@/context/ContentContext';
import { ContentFormInput } from '@/types/content';
import { ContentForm } from '@/components/form/ContentForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { colors, spacing } from '@/theme';

export default function EditContentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getContentById, updateContent } = useContents();

  const contentId = Number(id);
  const content = getContentById(contentId);

  if (!content) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyWrapper}>
          <EmptyState
            testID="edit-not-found"
            title="Conteúdo não encontrado"
            description="O filme ou série que você tentou editar não existe no catálogo."
            actionLabel="Voltar ao Catálogo"
            onAction={() => router.replace('/')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleUpdate = (data: ContentFormInput) => {
    updateContent(content.id, data);
    if (router.canGoBack && router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/content/${content.id}`);
    }
  };

  const handleCancel = () => {
    if (router.canGoBack && router.canGoBack()) {
      router.back();
    } else {
      router.replace(`/content/${content.id}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="edit-content-screen">
      <ContentForm
        mode="edit"
        initialValues={{
          type: content.type,
          title: content.title,
          description: content.description,
          genre: content.genre,
          releaseYear: content.releaseYear,
          duration: content.duration,
          seasons: content.seasons,
          episodes: content.episodes,
          image: content.image,
        }}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyWrapper: {
    padding: spacing.lg,
  },
});
