import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { Content, ContentFormInput, Evaluation } from '@/types/content';
import { initialContents } from '@/data/initialContents';
import { calculateAverageRating } from '@/utils/ratingCalculator';

export type ContentAction =
  | { type: 'ADD_CONTENT'; payload: { id: number; data: ContentFormInput; createdAt?: Date } }
  | { type: 'UPDATE_CONTENT'; payload: { id: number; data: ContentFormInput } }
  | { type: 'DELETE_CONTENT'; payload: { id: number } }
  | {
      type: 'ADD_EVALUATION';
      payload: { contentId: number; score: number; comment: string; createdAt?: Date };
    }
  | { type: 'RESET_CATALOG' };

export function normalizeContentFields(data: ContentFormInput): ContentFormInput {
  if (data.type === 'movie') {
    return {
      type: 'movie',
      title: data.title.trim(),
      description: data.description.trim(),
      genre: data.genre.trim(),
      releaseYear: Number(data.releaseYear),
      duration: Number(data.duration || 0),
      image: data.image.trim(),
    };
  }

  return {
    type: 'series',
    title: data.title.trim(),
    description: data.description.trim(),
    genre: data.genre.trim(),
    releaseYear: Number(data.releaseYear),
    seasons: Number(data.seasons || 1),
    episodes: Number(data.episodes || 1),
    image: data.image.trim(),
  };
}

export function contentReducer(state: Content[], action: ContentAction): Content[] {
  switch (action.type) {
    case 'ADD_CONTENT': {
      const normalized = normalizeContentFields(action.payload.data);
      const newContent: Content = {
        id: action.payload.id,
        ...normalized,
        rating: 0,
        evaluations: [],
        createdAt: action.payload.createdAt ?? new Date(),
      };
      return [newContent, ...state];
    }

    case 'UPDATE_CONTENT': {
      const { id, data } = action.payload;
      const normalized = normalizeContentFields(data);
      return state.map((item) => {
        if (item.id !== id) return item;
        const updated: Content = {
          id: item.id,
          ...normalized,
          rating: item.rating,
          evaluations: item.evaluations,
          createdAt: item.createdAt,
        };
        return updated;
      });
    }

    case 'DELETE_CONTENT': {
      return state.filter((item) => item.id !== action.payload.id);
    }

    case 'ADD_EVALUATION': {
      const { contentId, score, comment, createdAt } = action.payload;
      const clampedScore = Math.max(1, Math.min(10, Number(score)));

      return state.map((item) => {
        if (item.id !== contentId) return item;

        const nextEvalId =
          item.evaluations.reduce((maxId, ev) => Math.max(maxId, ev.id), 0) + 1;

        const newEvaluation: Evaluation = {
          id: nextEvalId,
          score: clampedScore,
          comment: comment.trim(),
          createdAt: createdAt ?? new Date(),
        };

        const updatedEvaluations = [newEvaluation, ...item.evaluations];
        const updatedRating = calculateAverageRating(updatedEvaluations);

        return {
          ...item,
          evaluations: updatedEvaluations,
          rating: updatedRating,
        };
      });
    }

    case 'RESET_CATALOG': {
      return [...initialContents];
    }

    default:
      return state;
  }
}

export interface ContentContextValue {
  contents: Content[];
  addContent: (data: ContentFormInput) => Content;
  updateContent: (id: number, data: ContentFormInput) => void;
  deleteContent: (id: number) => void;
  addEvaluation: (contentId: number, score: number, comment: string) => void;
  getContentById: (id: number) => Content | undefined;
  resetCatalog: () => void;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export interface ContentProviderProps {
  children: React.ReactNode;
  initialData?: Content[];
}

export function ContentProvider({ children, initialData = initialContents }: ContentProviderProps) {
  const [contents, dispatch] = useReducer(contentReducer, initialData);

  const addContent = useCallback(
    (data: ContentFormInput): Content => {
      const nextId = contents.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
      const createdAt = new Date();
      dispatch({ type: 'ADD_CONTENT', payload: { id: nextId, data, createdAt } });

      const normalized = normalizeContentFields(data);
      return {
        id: nextId,
        ...normalized,
        rating: 0,
        evaluations: [],
        createdAt,
      };
    },
    [contents]
  );

  const updateContent = useCallback((id: number, data: ContentFormInput) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: { id, data } });
  }, []);

  const deleteContent = useCallback((id: number) => {
    dispatch({ type: 'DELETE_CONTENT', payload: { id } });
  }, []);

  const addEvaluation = useCallback((contentId: number, score: number, comment: string) => {
    dispatch({
      type: 'ADD_EVALUATION',
      payload: { contentId, score, comment, createdAt: new Date() },
    });
  }, []);

  const getContentById = useCallback(
    (id: number): Content | undefined => {
      return contents.find((item) => item.id === Number(id));
    },
    [contents]
  );

  const resetCatalog = useCallback(() => {
    dispatch({ type: 'RESET_CATALOG' });
  }, []);

  const value = useMemo<ContentContextValue>(
    () => ({
      contents,
      addContent,
      updateContent,
      deleteContent,
      addEvaluation,
      getContentById,
      resetCatalog,
    }),
    [contents, addContent, updateContent, deleteContent, addEvaluation, getContentById, resetCatalog]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContents(): ContentContextValue {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContents deve ser utilizado dentro de um ContentProvider');
  }
  return context;
}
