const entries = [
  {
    id: 1,
    userId: 1,
    token: 'test',
    ip: '0.0.0.0',
    lastUsedAt: null,
    createdAt: '2019-11-07T22:05:51.323Z',
    updatedAt: '2019-11-07T22:05:51.323Z',
  },
  {
    id: 2,
    userId: 2,
    token: 'test-1',
    ip: '0.0.0.0',
    lastUsedAt: null,
    createdAt: '2019-11-07T22:05:51.323Z',
    updatedAt: '2019-11-07T22:05:51.323Z',
  },
];

module.exports = entries.map(data => ({ model: 'RefreshToken', data }));
