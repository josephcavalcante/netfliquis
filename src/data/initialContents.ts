import { Content } from '@/types/content';

export const initialContents: Content[] = [
  {
    id: 1,
    type: 'movie',
    title: 'Interestelar',
    description:
      'Uma equipe de exploradores viaja pelo espaço em busca de um novo lar para a humanidade.',
    genre: 'Ficção científica',
    releaseYear: 2014,
    duration: 169,
    image: '/images/interestelar.jpg',
    rating: 9.0,
    evaluations: [
      {
        id: 1,
        score: 10,
        comment: 'Um dos melhores filmes que já assisti!',
        createdAt: new Date('2026-10-15T14:30:00Z'),
      },
      {
        id: 2,
        score: 8,
        comment: 'Excelente história e fotografia.',
        createdAt: new Date('2026-10-16T18:10:00Z'),
      },
    ],
    createdAt: new Date('2026-10-01T10:00:00Z'),
  },
  {
    id: 2,
    type: 'series',
    title: 'Stranger Things',
    description:
      'Um grupo de amigos enfrenta acontecimentos sobrenaturais em sua cidade.',
    genre: 'Suspense',
    releaseYear: 2016,
    seasons: 4,
    episodes: 34,
    image: '/images/stranger-things.jpg',
    rating: 8.7,
    evaluations: [],
    createdAt: new Date('2026-10-02T11:00:00Z'),
  },
  {
    id: 3,
    type: 'movie',
    title: 'Oppenheimer',
    description:
      'A história do físico J. Robert Oppenheimer e seu papel crucial no desenvolvimento da bomba atômica durante a Segunda Guerra Mundial.',
    genre: 'Drama',
    releaseYear: 2023,
    duration: 180,
    image: '/images/oppenheimer.jpg',
    rating: 9.5,
    evaluations: [
      {
        id: 1,
        score: 10,
        comment: 'Trilha sonora impecável e direção magistral.',
        createdAt: new Date('2026-10-20T20:00:00Z'),
      },
      {
        id: 2,
        score: 9,
        comment: 'Atuação incrível de Cillian Murphy.',
        createdAt: new Date('2026-10-21T09:15:00Z'),
      },
    ],
    createdAt: new Date('2026-10-05T12:00:00Z'),
  },
  {
    id: 4,
    type: 'series',
    title: 'Breaking Bad',
    description:
      'Um professor de química do ensino médio diagnosticado com câncer de pulmão inoperável passa a fabricar e vender metanfetamina para garantir o futuro de sua família.',
    genre: 'Drama',
    releaseYear: 2008,
    seasons: 5,
    episodes: 62,
    image: '/images/breaking-bad.jpg',
    rating: 10.0,
    evaluations: [
      {
        id: 1,
        score: 10,
        comment: 'Roteiro perfeito do início ao fim.',
        createdAt: new Date('2026-10-25T21:45:00Z'),
      },
    ],
    createdAt: new Date('2026-10-08T15:00:00Z'),
  },
  {
    id: 5,
    type: 'movie',
    title: 'Duna: Parte Dois',
    description:
      'Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.',
    genre: 'Ficção científica',
    releaseYear: 2024,
    duration: 166,
    image: '/images/duna-2.jpg',
    rating: 9.0,
    evaluations: [
      {
        id: 1,
        score: 9,
        comment: 'Experiência visual e sonora impressionante!',
        createdAt: new Date('2026-11-01T17:00:00Z'),
      },
    ],
    createdAt: new Date('2026-10-12T09:30:00Z'),
  },
  {
    id: 6,
    type: 'series',
    title: 'The Last of Us',
    description:
      'Vinte anos após a destruição da civilização moderna por um fungo, Joel é contratado para tirar Ellie de uma zona de quarentena opressiva.',
    genre: 'Ação',
    releaseYear: 2023,
    seasons: 1,
    episodes: 9,
    image: '/images/the-last-of-us.jpg',
    rating: 9.0,
    evaluations: [
      {
        id: 1,
        score: 9,
        comment: 'Adaptação fiel e emocionante.',
        createdAt: new Date('2026-11-05T22:10:00Z'),
      },
    ],
    createdAt: new Date('2026-10-14T16:20:00Z'),
  },
];

export const GENRE_SUGGESTIONS = [
  'Ficção científica',
  'Suspense',
  'Drama',
  'Ação',
  'Comédia',
  'Terror',
  'Animação',
  'Documentário',
  'Fantasia',
];
