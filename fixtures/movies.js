const entries = [
  {
    id: 1,
    adult: false,
    backdropPath: '/test',
    budget: 50000,
    homepage: 'https://google.fr',
    imdbId: '1234',
    originalLanguage: 'fr-FR',
    originalTitle: 'Test original',
    overview: 'Test description',
    popularity: 1.42,
    posterPath: '/poster',
    releaseDate: '2020-02-02',
    runtime: 160,
    status: 'Up',
    tagline: 'This test movie',
    title: 'Test movie',
    voteAverage: 1.745,
    voteCount: 154,
    productionCompanies: [{ company: 'test-comp ' }],
    productionCountries: ['fr', 'us'],
    spokenLanguages: ['fr', 'en'],
    videos: [{ link: 'https://youtube.com' }],
    credits: {
      cast: [{ person: 'one' }],
      crew: [{ person: 'two' }],
    },
    images: [{ href: '/test-image ' }],
    keywords: [{ id: 1, name: 'test' }],
  },
];

module.exports = entries.map(data => ({ model: 'Movie', data }));
