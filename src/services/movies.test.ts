// eslint-disable-next-line import/no-extraneous-dependencies
import fixtures from 'sequelize-fixtures';
import Movies from './movies';
import { sequelize, repositories } from '../models';
import { GenreInstance } from '../models/genres';

describe('Movies service', () => {
  beforeAll(async () => {
    await sequelize.sync();
    await fixtures.loadFiles(
      ['fixtures/genres.js', 'fixtures/movies.js', 'fixtures/movieGenres.js'],
      repositories,
    );
  });

  afterAll(() => sequelize.dropAllSchemas({}));

  it('should get existing movie', async () => {
    const movie = await Movies.get<{ genres: GenreInstance[] }>(1, 'genres');
    expect(movie!.genres).toEqual(
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
