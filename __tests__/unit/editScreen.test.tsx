import React from 'react';
import { Text, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import EditContentScreen from '../../app/content/edit/[id]';
import { ContentProvider, useContents } from '@/context/ContentContext';

let mockParamId = '1';
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: mockParamId }),
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
    canGoBack: () => true,
  }),
}));

function EditVerificationWrapper() {
  const { getContentById } = useContents();
  const item = getContentById(1);
  return (
    <View>
      <Text testID="current-title-1">{item?.title}</Text>
      <Text testID="current-duration-1">{item?.duration}</Text>
      <EditContentScreen />
    </View>
  );
}

describe('[Issue #7] Tela 3: Editar Conteúdo Unit Tests', () => {
  beforeEach(() => {
    mockParamId = '1';
    mockReplace.mockClear();
    mockBack.mockClear();
  });

  it('pre-populates form with current content data and updates record in memory', () => {
    const { getByTestId } = render(
      <ContentProvider>
        <EditVerificationWrapper />
      </ContentProvider>
    );

    // Pre-populated values for Interestelar (id: 1)
    expect(getByTestId('form-input-title').props.value).toBe('Interestelar');
    expect(getByTestId('form-input-duration').props.value).toBe('169');

    // Modify title and duration
    fireEvent.changeText(getByTestId('form-input-title'), 'Interestelar 10 Anos');
    fireEvent.changeText(getByTestId('form-input-duration'), '172');

    fireEvent.press(getByTestId('form-submit-btn'));

    expect(getByTestId('current-title-1').props.children).toBe('Interestelar 10 Anos');
    expect(getByTestId('current-duration-1').props.children).toBe(172);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('renders not-found EmptyState when content id does not exist', () => {
    mockParamId = '9999';
    const { getByTestId } = render(
      <ContentProvider>
        <EditContentScreen />
      </ContentProvider>
    );

    expect(getByTestId('edit-not-found')).toBeTruthy();
  });
});
