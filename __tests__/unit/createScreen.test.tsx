import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import CreateContentScreen from '../../app/content/create';
import { ContentProvider } from '@/context/ContentContext';

const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
    canGoBack: () => true,
  }),
}));

describe('[Issue #6] Tela 2: Cadastrar Conteúdo Unit Tests', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockBack.mockClear();
  });

  it('registers a new movie in memory and redirects to its details screen', () => {
    const { getByTestId } = render(
      <ContentProvider>
        <CreateContentScreen />
      </ContentProvider>
    );

    fireEvent.changeText(getByTestId('form-input-title'), 'Blade Runner 2049');
    fireEvent.changeText(
      getByTestId('form-input-description'),
      'Um novo blade runner descobre um segredo enterrado há muito tempo.'
    );
    fireEvent.changeText(getByTestId('form-input-genre'), 'Ficção científica');
    fireEvent.changeText(getByTestId('form-input-year'), '2017');
    fireEvent.changeText(getByTestId('form-input-duration'), '164');

    fireEvent.press(getByTestId('form-submit-btn'));
    expect(mockReplace).toHaveBeenCalledWith('/content/7');
  });

  it('registers a new series with seasons and episodes and redirects to its details screen', () => {
    const { getByTestId } = render(
      <ContentProvider>
        <CreateContentScreen />
      </ContentProvider>
    );

    fireEvent.press(getByTestId('form-type-series'));
    fireEvent.changeText(getByTestId('form-input-title'), 'Silo');
    fireEvent.changeText(
      getByTestId('form-input-description'),
      'Em um futuro distópico e tóxico, milhares vivem em um gigantesco silo subterrâneo.'
    );
    fireEvent.changeText(getByTestId('form-input-genre'), 'Ficção científica');
    fireEvent.changeText(getByTestId('form-input-year'), '2023');
    fireEvent.changeText(getByTestId('form-input-seasons'), '2');
    fireEvent.changeText(getByTestId('form-input-episodes'), '20');

    fireEvent.press(getByTestId('form-submit-btn'));
    expect(mockReplace).toHaveBeenCalledWith('/content/7');
  });
});
