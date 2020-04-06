const entries = [
  {
    id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2890',
    torrentHash: 'abcdef',
    name: 'file1.mp4',
    basename: 'file1.mp4',
    extension: 'mp4',
    length: 1,
    bytesCompleted: 1,
    hostId: 1,
    transcodedAt: '2019-11-07T22:05:51.323Z',
    transcodingAt: '2019-11-07T20:00:00.000Z',
  },
  {
    id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2891',
    torrentHash: 'abcdef',
    name: 'file2.mp4',
    extension: 'mp4',
    length: 12,
    hostId: 1,
    transcodingAt: '2019-11-07T20:00:00.000Z',
  },
  {
    id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2892',
    torrentHash: 'abcdef',
    name: 'file3.mp4',
    length: 50,
    hostId: 1,
  },
  {
    id: '27bb08c8-db16-4d1f-b0d2-44f70f39cd0a',
    torrentHash: 'abcdef',
    basename: 'test.rar',
    name: 'test.rar',
    directory: '',
    extension: 'rar',
    hostId: 1,
    length: 50,
    bytesCompleted: 50,
  },
];

module.exports = entries.map(data => ({ model: 'File', data }));
