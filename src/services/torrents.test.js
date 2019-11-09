const fixtures = require('sequelize-fixtures');
const Torrents = require('./torrents');
const { db, ...models } = require('../models');

describe('Torrents', () => {
  beforeAll(async () => {
    await db.sync();
    await fixtures.loadFiles(
      ['fixtures/users.js', 'fixtures/hosts.js', 'fixtures/torrents.js'],
      models,
    );
  });

  afterAll(() => db.dropAllSchemas());

  it('Should retreive torrent', async () => {
    const result = await Torrents.get('abcdef');
    expect(result).not.toBe(null);
  });

  it('Should create a new torrent', async () => {
    const torrent = await Torrents.upsert(
      {
        hash: 'mnopqrs',
        userId: 1,
        hostId: 1,
      },
      true,
    );
    expect(torrent.dataValues).toMatchObject({ hash: 'mnopqrs' });
  });

  it('Should update userId of existing torrent', async () => {
    const torrent = await Torrents.upsert(
      {
        hash: 'abcdef',
        userId: 1,
        hostId: 1,
      },
      true,
    );
    expect(torrent.dataValues).toMatchObject({ hash: 'abcdef', userId: 1 });
  });

  it('Should not create nor update torrent', async () =>
    expect(
      Torrents.upsert(
        {
          hash: 'fghijkl',
          userId: 2,
          hostId: 1,
        },
        true,
      ),
    ).rejects.toThrow());
});
