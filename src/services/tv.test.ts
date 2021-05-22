// eslint-disable-next-line import/no-extraneous-dependencies
import fixtures from 'sequelize-fixtures';
import Tv from './tv';
import { sequelize, repositories } from '../models';
import { GenreInstance } from '../models/genres';

describe('Movies service', () => {
  beforeAll(async () => {
    await sequelize.sync();
    await fixtures.loadFiles(
      ['fixtures/genres.js', 'fixtures/tv.js', 'fixtures/tvGenres.js'],
      repositories,
    );
  });

  afterAll(() => sequelize.dropAllSchemas({}));

  it('should get existing tv', async () => {
    const tv = await Tv.get<{ genres: GenreInstance[] }>(42, 'genres');
    expect(tv!.genres).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Action' }),
        expect.objectContaining({ name: 'Thriller' }),
      ]),
    );
  });

  it('should create new tv with genre', async () => {
    const tv = await Tv.create({
      id: 32,
      genres: [{ name: 'Action' }, { name: 'New Genre' }],
    });
    expect(tv.id).toBe(32);
    expect(tv.genres).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Action' }),
        expect.objectContaining({ name: 'New Genre' }),
      ]),
    );
  });

  it('should update tv and transform keys', async () => {
    const tv = await Tv.create({
      id: 51,
      genres: [{ name: 'Test 1' }, { name: 'Thriller' }],
    });

    expect(tv.genres).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Test 1' }),
        expect.objectContaining({ name: 'Thriller' }),
      ]),
    );

    await Tv.update(tv, {
      genres: [{ name: 'Updated' }],
      id: 56,
      overview: 'test overview',
    });

    expect(tv.genres).toEqual([expect.objectContaining({ name: 'Updated' })]);
    expect(tv.overview).toEqual('test overview');
    expect(tv.id).toBe(51);
  });

  it('should found episode', async () => {
    const tv = await Tv.get(42);
    expect(Tv.hasEpisode(tv!, 1, 1)).toBe(true);
  });

  it('should not found episode', async () => {
    const tv = await Tv.get(42);
    expect(Tv.hasEpisode(tv!, 1, 52)).toBe(false);
    expect(Tv.hasEpisode(tv!, 2, 1)).toBe(false);
  });
});
