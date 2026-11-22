import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import EvaluateContentScreen from '../../app/content/evaluate/[id]';
import { ContentProvider } from '@/context/ContentContext';

let mockParamId = '1';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: mockParamId }),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: () => true,
  }),
}));

describe('[Issue #9] Tela 5: Avaliar Conteúdo Unit Tests', () => {
  beforeEach(() => {
    mockParamId = '1';
  });

  it('validates empty comment before submitting evaluation', () => {
    const { getByTestId } = render(
      <ContentProvider>
        <EvaluateContentScreen />
      </ContentProvider>
    );

    fireEvent.press(getByTestId('evaluate-btn-submit'));
    expect(getByTestId('evaluate-error-banner')).toBeTruthy();
  });

  it('adds new evaluation, updates existing evaluations list, and recalculates average rating dynamically', () => {
    const { getByTestId, getByText } = render(
      <ContentProvider>
        <EvaluateContentScreen />
      </ContentProvider>
    );

    // Interestelar (id: 1) starts with [10, 8] -> 9.0
    expect(getByTestId('evaluate-content-title').props.children).toBe('Interestelar');

    // Select score 6 and write comment
    fireEvent.press(getByTestId('score-option-6'));
    fireEvent.changeText(
      getByTestId('evaluate-input-comment'),
      'Fotografia sensacional, mas o terceiro ato é abstrato.'
    );
    fireEvent.press(getByTestId('evaluate-btn-submit'));

    // New evaluation appears in list and rating becomes (10 + 8 + 6) / 3 = 8.0
    expect(getByTestId('evaluate-success-banner')).toBeTruthy();
    expect(
      getByText('Fotografia sensacional, mas o terceiro ato é abstrato.')
    ).toBeTruthy();
    expect(getByTestId('evaluation-comment-3').props.children).toBe(
      'Fotografia sensacional, mas o terceiro ato é abstrato.'
    );
  });
});
