const entries = [
  {
    hash: 'abcdef',
    userId: null,
    hostId: 1,
  },
  {
    hash: 'fghijkl',
    userId: 1,
    hostId: 1,
    totalSize: 50,
  },
  {
    hash: 'zedsdead',
    userId: 1,
    hostId: 1,
    totalSize: 100,
  },
  {
    hash: 'media',
    userId: null,
    hostId: 1,
    totalSize: 100,
  },
];

module.exports = entries.map(data => ({ model: 'Torrent', data }));
