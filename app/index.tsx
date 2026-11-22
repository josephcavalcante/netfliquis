import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function CatalogScreenPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NETFLIQUIS</Text>
      <Text style={styles.subtitle}>Catálogo de Filmes e Séries</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    color: '#E50914',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 3,
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 16,
    marginTop: 8,
  },
});
