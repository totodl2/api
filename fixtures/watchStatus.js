const entries = [
  {
    id: 1,
    userId: 1,
    fileId: '27bb08c8-db16-4d1f-b0d2-44f70f39cd0a',
    position: 42,
  },
  {
    id: 2,
    userId: 1,
    movieId: 1,
    position: 51,
    seenAt: '2019-11-07T20:00:00.000Z',
  },
  {
    id: 3,
    userId: 1,
    tvId: 42,
    seasonNumber: 1,
    episodeNumber: 2,
    position: 1,
    seenAt: '2019-11-07T20:00:00.000Z',
  },
  {
    id: 4,
    userId: 1,
    tvId: 42,
    seasonNumber: 1,
    episodeNumber: 3,
    position: 1,
    seenAt: '2019-11-07T20:00:00.000Z',
  },
  {
    id: 5,
    userId: 1,
    tvId: 42,
    seasonNumber: 2,
    episodeNumber: 1,
    position: 1,
  },
];

module.exports = entries.map(data => ({ model: 'WatchStatus', data }));
