const fixtures = require('sequelize-fixtures');
const Genres = require('./genres');
const { db, ...models } = require('../models');

describe('Genres service', () => {
  beforeAll(async () => {
    await db.sync();
    await fixtures.loadFiles(['fixtures/genres.js'], models);
  });

  afterAll(() => db.dropAllSchemas());

  it('Should create new genre', async () => {
    const newGenre = await Genres.findOrCreate('Test');
    expect(newGenre.id).toBe(3);
    expect(newGenre.name).toBe('Test');
  });

  it('Should retrieve existing genre', async () => {
    const existing = await Genres.findOrCreate('Action');
    expect(existing.id).toBe(1);
    expect(existing.name).toBe('Action');
  });
});
