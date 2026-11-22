import { initialContents } from '@/data/initialContents';
import { calculateAverageRating } from '@/utils/ratingCalculator';
import { DEFAULT_COVER_URI, resolveContentImage } from '@/utils/imageResolver';
import {
  formatContentTypeLabel,
  formatDate,
  formatDuration,
  formatRating,
  formatSeriesInfo,
} from '@/utils/formatters';

describe('[Issue #2] Data Modeling, Seed & Domain Utilities', () => {
  describe('initialContents specification compliance', () => {
    it('contains Interestelar (movie) with exact professor specification attributes', () => {
      const interestelar = initialContents.find((c) => c.id === 1);
      expect(interestelar).toBeDefined();
      expect(interestelar?.type).toBe('movie');
      expect(interestelar?.title).toBe('Interestelar');
      expect(interestelar?.genre).toBe('Ficção científica');
      expect(interestelar?.releaseYear).toBe(2014);
      expect(interestelar?.duration).toBe(169);
      expect(interestelar?.image).toBe('/images/interestelar.jpg');
      expect(interestelar?.rating).toBe(9.0);
      expect(interestelar?.evaluations).toHaveLength(2);
      expect(interestelar?.evaluations[0].score).toBe(10);
      expect(interestelar?.evaluations[1].score).toBe(8);
    });

    it('contains Stranger Things (series) with exact professor specification attributes', () => {
      const strangerThings = initialContents.find((c) => c.id === 2);
      expect(strangerThings).toBeDefined();
      expect(strangerThings?.type).toBe('series');
      expect(strangerThings?.title).toBe('Stranger Things');
      expect(strangerThings?.genre).toBe('Suspense');
      expect(strangerThings?.releaseYear).toBe(2016);
      expect(strangerThings?.seasons).toBe(4);
      expect(strangerThings?.episodes).toBe(34);
      expect(strangerThings?.image).toBe('/images/stranger-things.jpg');
      expect(strangerThings?.rating).toBe(8.7);
      expect(strangerThings?.evaluations).toEqual([]);
    });
  });

  describe('calculateAverageRating', () => {
    it('returns 0 for empty evaluations array', () => {
      expect(calculateAverageRating([])).toBe(0);
    });

    it('calculates exact average for Interestelar evaluations (10 and 8 -> 9.0)', () => {
      const evals = [
        { id: 1, score: 10, comment: 'Ótimo', createdAt: new Date() },
        { id: 2, score: 8, comment: 'Muito bom', createdAt: new Date() },
      ];
      expect(calculateAverageRating(evals)).toBe(9.0);
    });

    it('rounds average rating to 1 decimal place', () => {
      const evals = [
        { id: 1, score: 10, comment: 'A', createdAt: new Date() },
        { id: 2, score: 9, comment: 'B', createdAt: new Date() },
        { id: 3, score: 7, comment: 'C', createdAt: new Date() },
      ];
      expect(calculateAverageRating(evals)).toBe(8.7);
    });
  });

  describe('resolveContentImage', () => {
    it('maps specification paths (/images/interestelar.jpg and /images/stranger-things.jpg) to valid URLs', () => {
      const interestelarUri = resolveContentImage('/images/interestelar.jpg');
      const strangerUri = resolveContentImage('/images/stranger-things.jpg');
      expect(interestelarUri).toMatch(/^https:\/\//);
      expect(strangerUri).toMatch(/^https:\/\//);
    });

    it('preserves direct http/https URLs', () => {
      const customUrl = 'https://example.com/poster.jpg';
      expect(resolveContentImage(customUrl)).toBe(customUrl);
    });

    it('returns fallback cover URI for empty or unknown local paths', () => {
      expect(resolveContentImage('')).toBe(DEFAULT_COVER_URI);
      expect(resolveContentImage('/unknown/file.png')).toBe(DEFAULT_COVER_URI);
    });
  });

  describe('formatters', () => {
    it('formats content type labels in Portuguese', () => {
      expect(formatContentTypeLabel('movie')).toBe('Filme');
      expect(formatContentTypeLabel('series')).toBe('Série');
    });

    it('formats movie duration in minutes and hours', () => {
      expect(formatDuration(169)).toBe('169 min (2h 49m)');
      expect(formatDuration(120)).toBe('120 min (2h)');
      expect(formatDuration(45)).toBe('45 min');
    });

    it('formats series seasons and episodes', () => {
      expect(formatSeriesInfo(4, 34)).toBe('4 temporadas • 34 episódios');
      expect(formatSeriesInfo(1, 1)).toBe('1 temporada • 1 episódio');
    });

    it('formats rating and date accurately', () => {
      expect(formatRating(9)).toBe('9.0');
      expect(formatRating(0)).toBe('S/N');
      expect(formatDate(new Date(2026, 10, 22))).toBe('22/11/2026');
    });
  });
});
