import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ContentDetailsScreen from '../../app/content/[id]';
import { ContentProvider } from '@/context/ContentContext';

let mockParamId = '1';
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: mockParamId }),
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: jest.fn(),
  }),
}));

describe('[Issue #8] Tela 4: Detalhes do Conteúdo Unit Tests', () => {
  beforeEach(() => {
    mockParamId = '1';
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it('displays movie details, duration, average rating, and evaluations list for Interestelar', () => {
    const { getByTestId, getByText } = render(
      <ContentProvider>
        <ContentDetailsScreen />
      </ContentProvider>
    );

    expect(getByTestId('details-title').props.children).toBe('Interestelar');
    expect(getByTestId('details-specific-meta').props.children).toBe('169 min (2h 49m)');
    expect(getByText('Um dos melhores filmes que já assisti!')).toBeTruthy();
    expect(getByText('Excelente história e fotografia.')).toBeTruthy();
  });

  it('displays series details, seasons, and episodes for Stranger Things', () => {
    mockParamId = '2';
    const { getByTestId } = render(
      <ContentProvider>
        <ContentDetailsScreen />
      </ContentProvider>
    );

    expect(getByTestId('details-title').props.children).toBe('Stranger Things');
    expect(getByTestId('details-specific-meta').props.children).toBe(
      '4 temporadas • 34 episódios'
    );
    expect(getByTestId('details-empty-evaluations')).toBeTruthy();
  });

  it('navigates to Evaluate and Edit, and deletes content after modal confirmation', () => {
    const { getByTestId } = render(
      <ContentProvider>
        <ContentDetailsScreen />
      </ContentProvider>
    );

    fireEvent.press(getByTestId('details-btn-evaluate'));
    expect(mockPush).toHaveBeenCalledWith('/content/evaluate/1');

    fireEvent.press(getByTestId('details-btn-edit'));
    expect(mockPush).toHaveBeenCalledWith('/content/edit/1');

    // Open delete confirmation modal and confirm deletion
    fireEvent.press(getByTestId('details-btn-delete'));
    expect(getByTestId('confirm-modal')).toBeTruthy();
    fireEvent.press(getByTestId('confirm-modal-confirm'));

    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
