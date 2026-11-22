import React from 'react';
import { View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { ContentProvider, useContents } from '@/context/ContentContext';
import { ContentForm } from '@/components/form/ContentForm';
import { ContentCard } from '@/components/catalog/ContentCard';

function Milestone2FormIntegrationHarness() {
  const { contents, addContent } = useContents();

  return (
    <View>
      <ContentForm
        mode="create"
        onSubmit={(data) => addContent(data)}
        onCancel={() => {}}
      />
      {contents.map((item) => (
        <ContentCard key={item.id} content={item} onPress={() => {}} />
      ))}
    </View>
  );
}

describe('[Milestone 2 Integration] ContentForm & Catalog Component Integration', () => {
  it('validates required fields, dynamically toggles Movie/Series inputs, and integrates with in-memory catalog', () => {
    const { getByTestId, queryByTestId, getByText } = render(
      <ContentProvider>
        <Milestone2FormIntegrationHarness />
      </ContentProvider>
    );

    // 1. Validation blocks empty submission
    fireEvent.press(getByTestId('form-submit-btn'));
    expect(getByTestId('form-error-banner')).toBeTruthy();

    // 2. Movie mode displays duration and hides seasons/episodes
    expect(getByTestId('form-input-duration')).toBeTruthy();
    expect(queryByTestId('form-input-seasons')).toBeNull();

    // 3. Switching to Series mode displays seasons & episodes and hides duration
    fireEvent.press(getByTestId('form-type-series'));
    expect(queryByTestId('form-input-duration')).toBeNull();
    expect(getByTestId('form-input-seasons')).toBeTruthy();
    expect(getByTestId('form-input-episodes')).toBeTruthy();

    // 4. Fill Series form and submit into ContentContext
    fireEvent.changeText(getByTestId('form-input-title'), 'Andor');
    fireEvent.changeText(
      getByTestId('form-input-description'),
      'A jornada de Cassian Andor na formação da Aliança Rebelde.'
    );
    fireEvent.changeText(getByTestId('form-input-genre'), 'Ficção científica');
    fireEvent.changeText(getByTestId('form-input-year'), '2022');
    fireEvent.changeText(getByTestId('form-input-seasons'), '2');
    fireEvent.changeText(getByTestId('form-input-episodes'), '24');

    fireEvent.press(getByTestId('form-submit-btn'));

    // 5. Newly created series immediately renders as a ContentCard in the catalog (id: 7)
    expect(getByTestId('card-title-7').props.children).toBe('Andor');
    expect(getByText('2 temp • 24 ep')).toBeTruthy();
  });
});
