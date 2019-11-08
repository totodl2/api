const entries = [
  {
    id: 1,
    nickname: 'John',
    email: 'john@doe.com',
    password: 'john',
    createdAt: '2019-11-07T22:05:51.323Z',
    updatedAt: '2019-11-07T22:05:51.323Z',
  },
  {
    id: 2,
    nickname: 'Foo',
    email: 'foo@bar.com',
    password: 'foo',
    createdAt: '2019-11-07T22:06:12.323Z',
    updatedAt: '2019-11-07T22:06:12.323Z',
  },
];

module.exports = entries.map(data => ({ model: 'User', data }));
