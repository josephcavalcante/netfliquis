import { ContentType } from '@/types/content';

export function formatContentTypeLabel(type: ContentType): string {
  return type === 'movie' ? 'Filme' : 'Série';
}

export function formatDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) {
    return 'Duração não informada';
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${minutes} min (${hours}h)`;
  }

  return `${minutes} min (${hours}h ${remainingMinutes}m)`;
}

export function formatSeriesInfo(seasons?: number, episodes?: number): string {
  const s = seasons && seasons > 0 ? seasons : 1;
  const e = episodes && episodes > 0 ? episodes : 1;
  const seasonLabel = s === 1 ? '1 temporada' : `${s} temporadas`;
  const episodeLabel = e === 1 ? '1 episódio' : `${e} episódios`;
  return `${seasonLabel} • ${episodeLabel}`;
}

export function formatRating(rating?: number): string {
  if (typeof rating !== 'number' || rating <= 0) {
    return 'S/N';
  }
  return rating.toFixed(1);
}

export function formatDate(dateInput?: Date | string): string {
  if (!dateInput) return '';
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}
