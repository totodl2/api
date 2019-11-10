const fixtures = require('sequelize-fixtures');
const Files = require('./files');
const { db, ...models } = require('../models');

describe.only('Files', () => {
  beforeAll(async () => {
    await db.sync();
    await fixtures.loadFiles(
      [
        'fixtures/users.js',
        'fixtures/hosts.js',
        'fixtures/torrents.js',
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
});
