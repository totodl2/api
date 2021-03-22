const entries = [
  {
    id: 1,
    name: 'Action',
  },
  {
    id: 2,
    name: 'Thriller',
  },
];

module.exports = entries.map(data => ({ model: 'Genre', data }));
