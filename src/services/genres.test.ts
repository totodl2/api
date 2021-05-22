// eslint-disable-next-line import/no-extraneous-dependencies
import fixtures from 'sequelize-fixtures';
import Genres from './genres';
import { sequelize, repositories } from '../models';

describe('Genres service', () => {
  beforeAll(async () => {
    await sequelize.sync();
    await fixtures.loadFiles(['fixtures/genres.js'], repositories);
  });

  afterAll(() => sequelize.dropAllSchemas({}));

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
