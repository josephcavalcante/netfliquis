import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import CatalogScreen from '../../app/index';
import { ContentProvider } from '@/context/ContentContext';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('[Issue #5] Tela 1: Catálogo de Conteúdos Unit Tests', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('displays initial catalog items including Interestelar and Stranger Things', () => {
    const { getByTestId } = render(
      <ContentProvider>
        <CatalogScreen />
      </ContentProvider>
    );

    expect(getByTestId('card-title-1').props.children).toBe('Interestelar');
    expect(getByTestId('card-title-2').props.children).toBe('Stranger Things');
  });

  it('filters catalog by type (Todos, Filmes, Séries) and search query', () => {
    const { getByTestId, queryByTestId } = render(
      <ContentProvider>
        <CatalogScreen />
      </ContentProvider>
    );

    // Filter only Movies
    fireEvent.press(getByTestId('filter-tab-movie'));
    expect(getByTestId('card-title-1')).toBeTruthy(); // Interestelar
    expect(queryByTestId('card-title-2')).toBeNull(); // Stranger Things is a series

    // Filter only Series
    fireEvent.press(getByTestId('filter-tab-series'));
    expect(getByTestId('card-title-2')).toBeTruthy(); // Stranger Things
    expect(queryByTestId('card-title-1')).toBeNull();

    // Reset to All and search by title
    fireEvent.press(getByTestId('filter-tab-all'));
    fireEvent.changeText(getByTestId('catalog-search-input'), 'Stranger');
    expect(getByTestId('card-title-2')).toBeTruthy();
    expect(queryByTestId('card-title-1')).toBeNull();
  });

  it('navigates to Create Content and Content Details screens', () => {
    const { getByTestId } = render(
      <ContentProvider>
        <CatalogScreen />
      </ContentProvider>
    );

    fireEvent.press(getByTestId('btn-go-create'));
    expect(mockPush).toHaveBeenCalledWith('/content/create');

    fireEvent.press(getByTestId('content-card-1'));
    expect(mockPush).toHaveBeenCalledWith('/content/1');
  });
});
