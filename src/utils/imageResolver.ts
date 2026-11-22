export interface PresetCover {
  label: string;
  path: string;
  uri: string;
}

const IMAGE_MAP: Record<string, string> = {
  '/images/interestelar.jpg':
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  '/images/stranger-things.jpg':
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
  '/images/oppenheimer.jpg':
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  '/images/breaking-bad.jpg':
    'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
  '/images/duna-2.jpg':
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  '/images/the-last-of-us.jpg':
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  '/images/scifi-space.jpg':
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80',
  '/images/action-cinema.jpg':
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
};

export const DEFAULT_COVER_URI =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

export const PRESET_COVERS: PresetCover[] = [
  {
    label: 'Espaço / Sci-Fi',
    path: '/images/interestelar.jpg',
    uri: IMAGE_MAP['/images/interestelar.jpg'],
  },
  {
    label: 'Suspense / Mistério',
    path: '/images/stranger-things.jpg',
    uri: IMAGE_MAP['/images/stranger-things.jpg'],
  },
  {
    label: 'Deserto / Épico',
    path: '/images/duna-2.jpg',
    uri: IMAGE_MAP['/images/duna-2.jpg'],
  },
  {
    label: 'Laboratório / Drama',
    path: '/images/breaking-bad.jpg',
    uri: IMAGE_MAP['/images/breaking-bad.jpg'],
  },
  {
    label: 'Galáxia / Aventura',
    path: '/images/scifi-space.jpg',
    uri: IMAGE_MAP['/images/scifi-space.jpg'],
  },
  {
    label: 'Cinema Clássico',
    path: '/images/action-cinema.jpg',
    uri: IMAGE_MAP['/images/action-cinema.jpg'],
  },
];

/**
 * Converte caminhos relativos da especificação (ex: "/images/interestelar.jpg")
 * ou URLs externas para uma URI válida para o componente <Image /> do React Native.
 */
export function resolveContentImage(imagePath?: string): string {
  if (!imagePath || !imagePath.trim()) {
    return DEFAULT_COVER_URI;
  }

  const trimmed = imagePath.trim();

  if (IMAGE_MAP[trimmed]) {
    return IMAGE_MAP[trimmed];
  }

  if (/^https?:\/\//i.test(trimmed) || /^data:image\//i.test(trimmed)) {
    return trimmed;
  }

  return DEFAULT_COVER_URI;
}
