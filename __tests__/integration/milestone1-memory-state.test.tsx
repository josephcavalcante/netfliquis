import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { ContentProvider, useContents } from '@/context/ContentContext';

function Milestone1Harness() {
  const {
    contents,
    addContent,
    updateContent,
    deleteContent,
    addEvaluation,
    getContentById,
  } = useContents();

  const interestelar = getContentById(1);
  const latestItem = contents[0];

  return (
    <View>
      <Text testID="total-count">{contents.length}</Text>
      <Text testID="interestelar-title">{interestelar?.title}</Text>
      <Text testID="interestelar-rating">{interestelar?.rating.toFixed(1)}</Text>
      <Text testID="interestelar-eval-count">{interestelar?.evaluations.length}</Text>
      <Text testID="latest-title">{latestItem?.title}</Text>
      <Text testID="latest-type">{latestItem?.type}</Text>

      <TouchableOpacity
        testID="btn-add-series"
        onPress={() =>
          addContent({
            type: 'series',
            title: 'Severance',
            description: 'Funcionários têm suas memórias divididas entre trabalho e vida pessoal.',
            genre: 'Ficção científica',
            releaseYear: 2022,
            seasons: 2,
            episodes: 19,
            image: '/images/stranger-things.jpg',
          })
        }
      >
        <Text>Add Series</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="btn-update-interestelar"
        onPress={() =>
          updateContent(1, {
            type: 'movie',
            title: 'Interestelar - Director Cut',
            description: 'Nova descrição atualizada.',
            genre: 'Ficção científica',
            releaseYear: 2014,
            duration: 175,
            image: '/images/interestelar.jpg',
          })
        }
      >
        <Text>Update Interestelar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="btn-evaluate-interestelar"
        onPress={() => addEvaluation(1, 6, 'Avaliação de teste de integração')}
      >
        <Text>Evaluate Interestelar</Text>
      </TouchableOpacity>

      <TouchableOpacity testID="btn-delete-stranger" onPress={() => deleteContent(2)}>
        <Text>Delete Stranger Things</Text>
      </TouchableOpacity>
    </View>
  );
}

describe('[Milestone 1 Integration] In-Memory State, CRUD & Dynamic Rating Integration', () => {
  it('executes full in-memory CRUD and dynamic evaluation recalculation reactively', () => {
    const { getByTestId } = render(
      <ContentProvider>
        <Milestone1Harness />
      </ContentProvider>
    );

    // 1. Initial seed state check
    expect(getByTestId('total-count').props.children).toBe(6);
    expect(getByTestId('interestelar-title').props.children).toBe('Interestelar');
    expect(getByTestId('interestelar-rating').props.children).toBe('9.0');
    expect(getByTestId('interestelar-eval-count').props.children).toBe(2);

    // 2. Create new Series in memory
    fireEvent.press(getByTestId('btn-add-series'));
    expect(getByTestId('total-count').props.children).toBe(7);
    expect(getByTestId('latest-title').props.children).toBe('Severance');
    expect(getByTestId('latest-type').props.children).toBe('series');

    // 3. Edit existing Movie in memory
    fireEvent.press(getByTestId('btn-update-interestelar'));
    expect(getByTestId('interestelar-title').props.children).toBe('Interestelar - Director Cut');
    expect(getByTestId('interestelar-rating').props.children).toBe('9.0');

    // 4. Add evaluation (score 6) and verify dynamic rating recalculation: (10 + 8 + 6) / 3 = 8.0
    fireEvent.press(getByTestId('btn-evaluate-interestelar'));
    expect(getByTestId('interestelar-eval-count').props.children).toBe(3);
    expect(getByTestId('interestelar-rating').props.children).toBe('8.0');

    // 5. Delete content from memory
    fireEvent.press(getByTestId('btn-delete-stranger'));
    expect(getByTestId('total-count').props.children).toBe(6);
  });
});
