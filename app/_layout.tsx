import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0B0B0F',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: '#0B0B0F',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Catálogo',
          }}
        />
        <Stack.Screen
          name="content/create"
          options={{
            title: 'Cadastrar Conteúdo',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="content/[id]"
          options={{
            title: 'Detalhes do Conteúdo',
          }}
        />
        <Stack.Screen
          name="content/edit/[id]"
          options={{
            title: 'Editar Conteúdo',
          }}
        />
        <Stack.Screen
          name="content/evaluate/[id]"
          options={{
            title: 'Avaliar Conteúdo',
          }}
        />
      </Stack>
    </>
  );
}
