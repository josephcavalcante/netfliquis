export interface PresetCover {
  label: string;
  path: string;
  uri: string;
}

const IMAGE_MAP: Record<string, string> = {
  '/images/interestelar.jpg':
    'https://image.tmdb.org/t/p/w1280/tR1XVa5bxgdh2bRw2u0DzrgkO2l.jpg',
  '/images/stranger-things.jpg':
    'https://image.tmdb.org/t/p/w1280/twfKp60THrcOIep9sjHODOOfO8d.jpg',
  '/images/oppenheimer.jpg':
    'https://image.tmdb.org/t/p/w1280/dUPQszWoRSE9FucJTbVp2bwEi9G.jpg',
  '/images/breaking-bad.jpg':
    'https://image.tmdb.org/t/p/w1280/hGwm9Cj3CdbJIqQWNExQqiYmCd4.jpg',
  '/images/duna-2.jpg':
    'https://image.tmdb.org/t/p/w1280/VMy4UGsI2u3f4fALGeCqCdsQBb.jpg',
  '/images/the-last-of-us.jpg':
    'https://image.tmdb.org/t/p/w1280/qWo5TP7mBijoZrfxBJkUMctkBt0.jpg',
};

export const DEFAULT_COVER_URI =
  'https://image.tmdb.org/t/p/w1280/tR1XVa5bxgdh2bRw2u0DzrgkO2l.jpg';

export const PRESET_COVERS: PresetCover[] = [
  {
    label: 'Interestelar',
    path: '/images/interestelar.jpg',
    uri: IMAGE_MAP['/images/interestelar.jpg'],
  },
  {
    label: 'Stranger Things',
    path: '/images/stranger-things.jpg',
    uri: IMAGE_MAP['/images/stranger-things.jpg'],
  },
  {
    label: 'Oppenheimer',
    path: '/images/oppenheimer.jpg',
    uri: IMAGE_MAP['/images/oppenheimer.jpg'],
  },
  {
    label: 'Breaking Bad',
    path: '/images/breaking-bad.jpg',
    uri: IMAGE_MAP['/images/breaking-bad.jpg'],
  },
  {
    label: 'Duna: Parte Dois',
    path: '/images/duna-2.jpg',
    uri: IMAGE_MAP['/images/duna-2.jpg'],
  },
  {
    label: 'The Last of Us',
    path: '/images/the-last-of-us.jpg',
    uri: IMAGE_MAP['/images/the-last-of-us.jpg'],
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
