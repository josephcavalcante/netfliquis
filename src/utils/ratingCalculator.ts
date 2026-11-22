import { Evaluation } from '@/types/content';

/**
 * Calcula dinamicamente a média aritmética das notas atribuídas a um conteúdo.
 * Retorna 0 quando não há avaliações ou arredonda para 1 casa decimal.
 */
export function calculateAverageRating(evaluations: Evaluation[]): number {
  if (!Array.isArray(evaluations) || evaluations.length === 0) {
    return 0;
  }

  const totalScore = evaluations.reduce((sum, item) => sum + Number(item.score || 0), 0);
  const average = totalScore / evaluations.length;

  return Number(average.toFixed(1));
}
