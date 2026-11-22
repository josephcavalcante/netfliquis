import React, { useState } from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ContentProvider } from '@/context/ContentContext';
import CatalogScreen from '../../app/index';
import CreateContentScreen from '../../app/content/create';
import ContentDetailsScreen from '../../app/content/[id]';
import EditContentScreen from '../../app/content/edit/[id]';
import EvaluateContentScreen from '../../app/content/evaluate/[id]';

let mockCurrentRoute = '/';
let mockCurrentParamId = '1';
let mockSetRouteTrigger: ((route: string) => void) | null = null;

function mockNavigateTo(path: string) {
  mockCurrentRoute = path;
  const match = path.match(/\/(\d+)$/);
  if (match) {
    mockCurrentParamId = match[1];
  }
  if (mockSetRouteTrigger) {
    mockSetRouteTrigger(path);
  }
}

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: mockCurrentParamId }),
  useRouter: () => ({
    push: (path: string) => mockNavigateTo(path),
    replace: (path: string) => mockNavigateTo(path),
    back: () => mockNavigateTo(`/content/${mockCurrentParamId}`),
    canGoBack: () => true,
  }),
}));

function Milestone3FiveScreensRouterHarness() {
  const [route, setRoute] = useState(mockCurrentRoute);
  mockSetRouteTrigger = setRoute;

  if (route === '/content/create') return <CreateContentScreen />;
  if (route.startsWith('/content/edit/')) return <EditContentScreen />;
  if (route.startsWith('/content/evaluate/')) return <EvaluateContentScreen />;
  if (route.startsWith('/content/')) return <ContentDetailsScreen />;
  return <CatalogScreen />;
}

describe('[Milestone 3 Integration] End-to-End 5 Mandatory Screens Flow in Memory', () => {
  beforeEach(() => {
    mockCurrentRoute = '/';
    mockCurrentParamId = '1';
  });

  it('navigates across all 5 screens performing Create, Details, Edit, Evaluate (with average calculation), and Delete', () => {
    const { getByTestId, queryByTestId, getByText } = render(
      <ContentProvider>
        <Milestone3FiveScreensRouterHarness />
      </ContentProvider>
    );

    // 1. TELA 1 (Catálogo): Start at Catalog and press "+ Novo Conteúdo"
    expect(getByTestId('header-logo')).toBeTruthy();
    fireEvent.press(getByTestId('btn-go-create'));

    // 2. TELA 2 (Cadastrar): Create a new Movie "A Chegada" (116 min)
    expect(getByTestId('create-content-screen')).toBeTruthy();
    fireEvent.changeText(getByTestId('form-input-title'), 'A Chegada');
    fireEvent.changeText(
      getByTestId('form-input-description'),
      'Uma linguista tenta se comunicar com visitantes extraterrestres.'
    );
    fireEvent.changeText(getByTestId('form-input-genre'), 'Ficção científica');
    fireEvent.changeText(getByTestId('form-input-year'), '2016');
    fireEvent.changeText(getByTestId('form-input-duration'), '116');
    fireEvent.press(getByTestId('form-submit-btn'));

    // 3. TELA 4 (Detalhes): Redirected to Details of newly created movie (id: 7)
    expect(getByTestId('details-content-screen')).toBeTruthy();
    expect(getByTestId('details-title').props.children).toBe('A Chegada');
    expect(getByTestId('details-specific-meta').props.children).toBe('116 min (1h 56m)');

    // 4. TELA 3 (Editar): Navigate to Edit, update title & duration, and return to Details
    fireEvent.press(getByTestId('details-btn-edit'));
    expect(getByTestId('edit-content-screen')).toBeTruthy();
    fireEvent.changeText(getByTestId('form-input-title'), 'A Chegada (Edição Especial)');
    fireEvent.changeText(getByTestId('form-input-duration'), '120');
    fireEvent.press(getByTestId('form-submit-btn'));

    // Back on TELA 4 (Detalhes) with updated values
    expect(getByTestId('details-title').props.children).toBe('A Chegada (Edição Especial)');
    expect(getByTestId('details-specific-meta').props.children).toBe('120 min (2h)');

    // 5. TELA 5 (Avaliar): Navigate to Evaluate, add two evaluations (10 and 8 -> average 9.0)
    fireEvent.press(getByTestId('details-btn-evaluate'));
    expect(getByTestId('evaluate-content-screen')).toBeTruthy();

    fireEvent.press(getByTestId('score-option-10'));
    fireEvent.changeText(getByTestId('evaluate-input-comment'), 'Roteiro brilhante!');
    fireEvent.press(getByTestId('evaluate-btn-submit'));

    fireEvent.press(getByTestId('score-option-8'));
    fireEvent.changeText(getByTestId('evaluate-input-comment'), 'Muito emocionante.');
    fireEvent.press(getByTestId('evaluate-btn-submit'));

    // Return to TELA 4 (Detalhes) and verify average rating 9.0 and both comments
    fireEvent.press(getByTestId('evaluate-btn-back'));
    expect(getByText('Roteiro brilhante!')).toBeTruthy();
    expect(getByText('Muito emocionante.')).toBeTruthy();
    expect(getByTestId('details-average-score').props.children.join('')).toContain('9.0 / 10');

    // 6. Delete Content on TELA 4 and verify removal on TELA 1 (Catálogo)
    fireEvent.press(getByTestId('details-btn-delete'));
    fireEvent.press(getByTestId('confirm-modal-confirm'));

    expect(getByTestId('header-logo')).toBeTruthy();
    expect(queryByTestId('card-title-7')).toBeNull();
  });
});
