const fixtures = require('sequelize-fixtures');
const Movies = require('./movies');
const { db, ...models } = require('../models');

describe('Movies service', () => {
  beforeAll(async () => {
    await db.sync();
    await fixtures.loadFiles(
      ['fixtures/genres.js', 'fixtures/movies.js', 'fixtures/movieGenres.js'],
      models,
    );
  });

  afterAll(() => db.dropAllSchemas());

  it('should get existing movie', async () => {
    const movie = await Movies.get(1, 'genres');
    expect(movie.genres).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Action' }),
        expect.objectContaining({ name: 'Thriller' }),
      ]),
    );
  });

  it('should create new movie with genre', async () => {
    const movie = await Movies.create({
      id: 32,
      genres: [{ name: 'Action' }, { name: 'New Genre' }],
    });
    expect(movie.id).toBe(32);
    expect(movie.genres).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Action' }),
        expect.objectContaining({ name: 'New Genre' }),
      ]),
    );
  });
});
