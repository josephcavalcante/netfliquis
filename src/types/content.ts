export type ContentType = 'movie' | 'series';

export type ContentFilterType = 'all' | ContentType;

export interface Evaluation {
  id: number;
  score: number;
  comment: string;
  createdAt: Date;
}

export interface Content {
  id: number;
  type: ContentType;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  duration?: number; // Para type === 'movie' (em minutos)
  seasons?: number;  // Para type === 'series'
  episodes?: number; // Para type === 'series'
  image: string;
  rating: number;
  evaluations: Evaluation[];
  createdAt: Date;
}

export interface ContentFormInput {
  type: ContentType;
  title: string;
  description: string;
  genre: string;
  releaseYear: number;
  duration?: number;
  seasons?: number;
  episodes?: number;
  image: string;
}
