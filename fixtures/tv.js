const entries = [
  {
    id: 42,
    backdropPath: '/test',
    firstAirDate: '2010-02-02',
    lastAirDate: '2020-02-02',
    homepage: 'https://google.fr',
    name: 'Test TV Show',
    numberOfEpisodes: 42,
    numberOfSeasons: 2,
    originalLanguage: 'FR',
    originalName: 'TVShow',
    inProduction: true,
    overview: 'Lorem upsum',
    popularity: 1.52,
    posterPath: '/poster',
    status: 'Ended',
    type: 'Scripted',
    voteAverage: 8.3,
    voteCount: 635,
    externalIds: {
      imdb_id: 'tt0877057',
      freebase_mid: '/m/02_2rby',
      freebase_id: null,
      tvrage_id: null,
      id: null,
    },
    episodeRunTime: [22],
    networks: [{ id: '57', name: 'NTV' }],
    originCountry: ['JP'],
    images: [{ filePath: '/test-image ' }],
    credits: {
      cast: [{ person: 'one' }],
      crew: [{ person: 'two' }],
    },
    keywords: [{ id: 1, name: 'test' }],
    videos: [{ link: 'https://youtube.com' }],
    seasons: [
      {
        name: 'Season 1',
        overview: '',
        seasonNumber: 1,
        episodes: [
          {
            id: '98745',
            episodeNumber: 1,
            name: 'Test ep',
            overview: 'Test ep overview',
          },
        ],
      },
    ],
  },
];

module.exports = entries.map(data => ({ model: 'Tv', data }));
