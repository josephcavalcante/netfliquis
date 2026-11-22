import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useContents } from '@/context/ContentContext';
import { ContentFormInput } from '@/types/content';
import { ContentForm } from '@/components/form/ContentForm';
import { colors } from '@/theme';

export default function CreateContentScreen() {
  const router = useRouter();
  const { addContent } = useContents();

  const handleCreate = (data: ContentFormInput) => {
    const created = addContent(data);
    router.replace(`/content/${created.id}`);
  };

  const handleCancel = () => {
    if (router.canGoBack && router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="create-content-screen">
      <ContentForm mode="create" onSubmit={handleCreate} onCancel={handleCancel} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
