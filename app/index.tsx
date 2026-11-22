import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useContents } from '@/context/ContentContext';
import { ContentFilterType } from '@/types/content';
import { colors, spacing } from '@/theme';
import { FeaturedHero } from '@/components/catalog/FeaturedHero';
import { FilterBar } from '@/components/catalog/FilterBar';
import { ContentCard } from '@/components/catalog/ContentCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CatalogScreen() {
  const router = useRouter();
  const { contents } = useContents();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ContentFilterType>('all');

  const counts = useMemo(() => {
    const movie = contents.filter((c) => c.type === 'movie').length;
    const series = contents.filter((c) => c.type === 'series').length;
    return {
      all: contents.length,
      movie,
      series,
    };
  }, [contents]);

  const filteredContents = useMemo(() => {
    return contents.filter((item) => {
      const matchesType = selectedType === 'all' || item.type === selectedType;
      if (!matchesType) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.genre.toLowerCase().includes(q) ||
        String(item.releaseYear).includes(q)
      );
    });
  }, [contents, selectedType, searchQuery]);

  const featuredContent = useMemo(() => {
    if (contents.length === 0) return undefined;
    return contents[0];
  }, [contents]);

  const handleNavigateDetails = (id: number) => {
    router.push(`/content/${id}`);
  };

  const handleNavigateEvaluate = (id: number) => {
    router.push(`/content/evaluate/${id}`);
  };

  const handleNavigateCreate = () => {
    router.push('/content/create');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo} testID="header-logo">
            NETFLIQUIS
          </Text>
          <Text style={styles.subtitle}>Catálogo de Filmes e Séries</Text>
        </View>
        <Button
          testID="btn-go-create"
          title="+ Novo Conteúdo"
          onPress={handleNavigateCreate}
          variant="primary"
          size="sm"
        />
      </View>

      <FlatList
        data={filteredContents}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {featuredContent && !searchQuery.trim() && selectedType === 'all' && (
              <FeaturedHero
                content={featuredContent}
                onPressDetails={handleNavigateDetails}
                onPressEvaluate={handleNavigateEvaluate}
              />
            )}

            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedType={selectedType}
              onSelectType={setSelectedType}
              counts={counts}
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedType === 'all'
                  ? 'Catálogo Completo'
                  : selectedType === 'movie'
                  ? 'Filmes Cadastrados'
                  : 'Séries Cadastradas'}
              </Text>
              <Text style={styles.sectionCount} testID="catalog-result-count">
                {filteredContents.length}{' '}
                {filteredContents.length === 1 ? 'título' : 'títulos'}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ContentCard content={item} onPress={handleNavigateDetails} />
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            testID="catalog-empty-state"
            title="Nenhum conteúdo encontrado"
            description={
              searchQuery.trim()
                ? 'Tente ajustar sua busca ou filtro de categoria.'
                : 'Cadastre seu primeiro filme ou série no catálogo.'
            }
            actionLabel="+ Cadastrar Conteúdo"
            onAction={handleNavigateCreate}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  logo: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  columnWrapper: {
    gap: spacing.md,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '50%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionCount: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
});
