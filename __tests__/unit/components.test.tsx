import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Badge } from '@/components/ui/Badge';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ScoreSelector } from '@/components/evaluation/ScoreSelector';
import { EvaluationCard } from '@/components/evaluation/EvaluationCard';
import { ContentCard } from '@/components/catalog/ContentCard';
import { initialContents } from '@/data/initialContents';

describe('[Issue #4] Design System & Reusable UI Components Unit Tests', () => {
  it('Badge renders correct Portuguese label for movie and series', () => {
    const { getByText, rerender } = render(<Badge contentType="movie" />);
    expect(getByText('Filme')).toBeTruthy();

    rerender(<Badge contentType="series" />);
    expect(getByText('Série')).toBeTruthy();
  });

  it('RatingBadge formats rating score and optional count', () => {
    const { getByText } = render(<RatingBadge rating={9.0} count={2} />);
    expect(getByText('9.0')).toBeTruthy();
    expect(getByText('(2)')).toBeTruthy();
  });

  it('Button triggers onPress when enabled and blocks when disabled', () => {
    const onPress = jest.fn();
    const { getByTestId, rerender } = render(
      <Button testID="btn" title="Salvar" onPress={onPress} />
    );

    fireEvent.press(getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);

    rerender(<Button testID="btn" title="Salvar" onPress={onPress} disabled />);
    fireEvent.press(getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('EmptyState renders message and triggers optional action button', () => {
    const onAction = jest.fn();
    const { getByText } = render(
      <EmptyState
        title="Nenhum conteúdo"
        description="Adicione um novo filme."
        actionLabel="Cadastrar"
        onAction={onAction}
      />
    );

    expect(getByText('Nenhum conteúdo')).toBeTruthy();
    fireEvent.press(getByText('Cadastrar'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('ConfirmModal invokes confirm and cancel callbacks', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const { getByTestId } = render(
      <ConfirmModal
        visible
        title="Excluir?"
        message="Confirma a exclusão?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    fireEvent.press(getByTestId('confirm-modal-cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);

    fireEvent.press(getByTestId('confirm-modal-confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('ScoreSelector selects score from 1 to 10', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(<ScoreSelector value={8} onChange={onChange} />);

    fireEvent.press(getByTestId('score-option-10'));
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('EvaluationCard renders evaluation score and comment', () => {
    const { getByText } = render(
      <EvaluationCard
        evaluation={{
          id: 1,
          score: 10,
          comment: 'Obra-prima absoluta!',
          createdAt: new Date(2026, 10, 22),
        }}
      />
    );

    expect(getByText('10/10')).toBeTruthy();
    expect(getByText('Obra-prima absoluta!')).toBeTruthy();
  });

  it('ContentCard displays content summary and triggers onPress with id', () => {
    const onPress = jest.fn();
    const movie = initialContents[0]; // Interestelar
    const { getByTestId, getByText } = render(
      <ContentCard content={movie} onPress={onPress} />
    );

    expect(getByText('Interestelar')).toBeTruthy();
    expect(getByText('Filme')).toBeTruthy();
    fireEvent.press(getByTestId(`content-card-${movie.id}`));
    expect(onPress).toHaveBeenCalledWith(movie.id);
  });
});
