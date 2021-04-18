const fixtures = require('sequelize-fixtures');
const WatchStatus = require('./watchStatus');
const File = require('./files');
const { db, ...models } = require('../models');

describe('WatchStatus', () => {
  const userId = 1;
  const newUserId = 2;
  const demoFile = '27bb08c8-db16-4d1f-b0d2-44f70f39cd0a';
  const demoTvFile = '233339d2-6374-442a-928e-fd818061d7d2';
  const demoMovieFile = '1f9ceea8-7940-4e0e-b8ad-4fff6f8e22dc';

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
        'fixtures/watchStatus.js',
      ],
      models,
    );
  });

  afterAll(() => db.dropAllSchemas());

  it('Should retrieve watch status with fileId only', async () => {
    const status = await WatchStatus.find(userId, await File.get(demoFile));
    expect(status.fileId).not.toBeNull();
    expect(status.tvId).toBeNull();
    expect(status.movieId).toBeNull();
  });

  it('Should retrieve watch status with tvId only', async () => {
    const status = await WatchStatus.find(userId, await File.get(demoTvFile));
    expect(status.fileId).toBeNull();
    expect(status.tvId).not.toBeNull();
    expect(status.episodeNumber).toBe(2);
    expect(status.seasonNumber).toBe(1);
    expect(status.movieId).toBeNull();
  });

  it('Should retrieve watch status with movieId only', async () => {
    const status = await WatchStatus.find(
      userId,
      await File.get(demoMovieFile),
    );
    expect(status.fileId).toBeNull();
    expect(status.movieId).not.toBeNull();
    expect(status.tvId).toBeNull();
  });

  it('Should update watch status for given file', async () => {
    const status = await WatchStatus.upsert(userId, await File.get(demoFile), {
      position: 123,
      length: 345,
    });

    expect(status.id).toBe(1);
    expect(status.length).toBe(345);
    expect(status.position).toBe(123);
  });

  it('Should update watch status for given file with movieId', async () => {
    const status = await WatchStatus.upsert(
      userId,
      await File.get(demoMovieFile),
      {
        position: 123,
        length: 456,
      },
    );

    expect(status.id).toBe(2);
    expect(status.movieId).not.toBeNull();
    expect(status.length).toBe(456);
    expect(status.position).toBe(123);
  });

  it('Should update watch status for given file with tvId', async () => {
    const status = await WatchStatus.upsert(
      userId,
      await File.get(demoTvFile),
      {
        position: 123,
        length: 456,
      },
    );

    expect(status.id).toBe(3);
    expect(status.tvId).not.toBeNull();
    expect(status.length).toBe(456);
    expect(status.position).toBe(123);
  });

  it('Should create watch status for given file', async () => {
    const status = await WatchStatus.upsert(
      newUserId,
      await File.get(demoFile),
      {
        position: 123,
        length: 456,
      },
    );

    expect([1, 2, 3]).not.toContain(status.id);
    expect(status.fileId).not.toBeNull();
    expect(status.length).toBe(456);
    expect(status.position).toBe(123);
  });

  it('Should create watch status for given file with tvId', async () => {
    const file = await File.get(demoTvFile);
    const status = await WatchStatus.upsert(newUserId, file, {
      position: 123,
      length: 456,
    });

    expect([1, 2, 3]).not.toContain(status.id);
    expect(status.userId).toBe(newUserId);
    expect(status.movieId).toBeFalsy();
    expect(status.tvId).not.toBeNull();
    expect(status.seasonNumber).toBe(file.seasonNumber);
    expect(status.episodeNumber).toBe(file.episodeNumber);
    expect(status.length).toBe(456);
    expect(status.position).toBe(123);
  });

  it('Should create watch status for given file with movieId', async () => {
    const status = await WatchStatus.upsert(
      newUserId,
      await File.get(demoMovieFile),
      {
        position: 123,
        length: 456,
      },
    );

    expect([1, 2, 3]).not.toContain(status.id);
    expect(status.userId).toBe(newUserId);
    expect(status.movieId).not.toBeNull();
    expect(status.tvId).toBeFalsy();
    expect(status.length).toBe(456);
    expect(status.position).toBe(123);
  });
});
