import { contentReducer } from '@/context/ContentContext';
import { initialContents } from '@/data/initialContents';

describe('[Issue #3] contentReducer Unit Tests', () => {
  it('ADD_CONTENT adds a movie with duration and strips series fields', () => {
    const nextState = contentReducer(initialContents, {
      type: 'ADD_CONTENT',
      payload: {
        id: 99,
        data: {
          type: 'movie',
          title: 'Matrix',
          description: 'Um programador descobre a verdade sobre sua realidade.',
          genre: 'Ficção científica',
          releaseYear: 1999,
          duration: 136,
          seasons: 5,
          episodes: 50,
          image: '/images/scifi-space.jpg',
        },
      },
    });

    expect(nextState).toHaveLength(initialContents.length + 1);
    const created = nextState[0];
    expect(created.id).toBe(99);
    expect(created.type).toBe('movie');
    expect(created.title).toBe('Matrix');
    expect(created.duration).toBe(136);
    expect(created.seasons).toBeUndefined();
    expect(created.episodes).toBeUndefined();
    expect(created.rating).toBe(0);
    expect(created.evaluations).toEqual([]);
  });

  it('ADD_CONTENT adds a series with seasons and episodes and strips movie duration', () => {
    const nextState = contentReducer(initialContents, {
      type: 'ADD_CONTENT',
      payload: {
        id: 100,
        data: {
          type: 'series',
          title: 'Dark',
          description: 'Viagens no tempo em uma pequena cidade alemã.',
          genre: 'Suspense',
          releaseYear: 2017,
          duration: 120,
          seasons: 3,
          episodes: 26,
          image: '/images/stranger-things.jpg',
        },
      },
    });

    const created = nextState[0];
    expect(created.id).toBe(100);
    expect(created.type).toBe('series');
    expect(created.seasons).toBe(3);
    expect(created.episodes).toBe(26);
    expect(created.duration).toBeUndefined();
  });

  it('UPDATE_CONTENT modifies fields while preserving existing evaluations and rating', () => {
    const nextState = contentReducer(initialContents, {
      type: 'UPDATE_CONTENT',
      payload: {
        id: 1,
        data: {
          type: 'movie',
          title: 'Interestelar (Edição IMAX)',
          description: 'Versão estendida remasterizada.',
          genre: 'Ficção científica',
          releaseYear: 2014,
          duration: 175,
          image: '/images/interestelar.jpg',
        },
      },
    });

    const updated = nextState.find((item) => item.id === 1);
    expect(updated?.title).toBe('Interestelar (Edição IMAX)');
    expect(updated?.duration).toBe(175);
    expect(updated?.rating).toBe(9.0);
    expect(updated?.evaluations).toHaveLength(2);
  });

  it('DELETE_CONTENT removes the target item from in-memory array', () => {
    const nextState = contentReducer(initialContents, {
      type: 'DELETE_CONTENT',
      payload: { id: 2 },
    });

    expect(nextState).toHaveLength(initialContents.length - 1);
    expect(nextState.find((item) => item.id === 2)).toBeUndefined();
  });

  it('ADD_EVALUATION appends evaluation and dynamically recalculates content rating', () => {
    // Interestelar (id: 1) starts with evaluations [10, 8] -> rating 9.0
    // Adding score 6 -> (10 + 8 + 6) / 3 = 8.0
    const nextState = contentReducer(initialContents, {
      type: 'ADD_EVALUATION',
      payload: {
        contentId: 1,
        score: 6,
        comment: 'Bom filme, porém longo.',
      },
    });

    const interestelar = nextState.find((item) => item.id === 1);
    expect(interestelar?.evaluations).toHaveLength(3);
    expect(interestelar?.evaluations[0].score).toBe(6);
    expect(interestelar?.evaluations[0].comment).toBe('Bom filme, porém longo.');
    expect(interestelar?.rating).toBe(8.0);
  });
});
