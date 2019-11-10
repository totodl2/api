const entries = [
  {
    id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2890',
    torrentHash: 'abcdef',
    name: 'file1.mp4',
    length: 1,
    hostId: 1,
  },
  {
    id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2891',
    torrentHash: 'abcdef',
    name: 'file2.mp4',
    length: 12,
    hostId: 1,
  },
  {
    id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2892',
    torrentHash: 'abcdef',
    name: 'file3.mp4',
    length: 50,
    hostId: 1,
  },
];

module.exports = entries.map(data => ({ model: 'File', data }));
