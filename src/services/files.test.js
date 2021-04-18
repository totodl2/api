const fixtures = require('sequelize-fixtures');
const Files = require('./files');
const Movies = require('./movies');
const Tv = require('./tv');
const { db, ...models } = require('../models');

describe('Files', () => {
  beforeAll(async () => {
    await db.sync();
    await fixtures.loadFiles(
      [
        'fixtures/users.js',
        'fixtures/hosts.js',
        'fixtures/torrents.js',
        'fixtures/movies.js',
        'fixtures/tv.js',
        'fixtures/files.js',
      ],
      models,
    );
  });

  afterAll(() => db.dropAllSchemas());

  it('Should retreive file', async () => {
    const result = await Files.get('a8a4e9d0-9639-4fcd-acc1-1703dc2b2890');
    expect(result).not.toBe(null);
  });

  it('Should update file', async () => {
    const file = await Files.upsert(
      {
        id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2891',
        bytesCompleted: 2,
      },
      true,
    );
    expect(file.dataValues).toMatchObject({
      id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2891',
      bytesCompleted: 2,
    });
  });

  it('Should find the subtitle when needed', async () => {
    const file = await Files.get('a8a4e9d0-9639-4fcd-acc1-1703dc2b2891');
    const sub = await Files.findSubtitle(file);
    expect(sub.id).toBe('4a061ef9-5514-4266-aa2e-e2df340e17d9');

    const noSubFile = await Files.get('a8a4e9d0-9639-4fcd-acc1-1703dc2b2892');
    const noSub = await Files.findSubtitle(noSubFile);
    expect(noSub).toBe(null);
  });

  it('should set movie to file', async () => {
    const file = await Files.get('a8a4e9d0-9639-4fcd-acc1-1703dc2b2890');
    const movie = await Movies.get(1);
    await Files.setMovie(file, movie);
    expect((await Files.get(file.id, 'movie')).movie.id).toBe(movie.id);
  });

  it('should set tv to file', async () => {
    const file = await Files.get('a8a4e9d0-9639-4fcd-acc1-1703dc2b2892');
    const tv = await Tv.get(42);
    await Files.setTv(file, tv, 1, 1);
    expect((await Files.get(file.id, 'tv')).tv.id).toBe(tv.id);
  });
});
