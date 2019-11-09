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
  },
];

module.exports = entries.map(data => ({ model: 'Torrent', data }));
