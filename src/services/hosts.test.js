const fixtures = require('sequelize-fixtures');
const Hosts = require('../services/hosts');
const { db, ...models } = require('../models');

describe('Hosts', () => {
  beforeAll(async () => {
    await db.sync();
    await fixtures.loadFile('fixtures/hosts.js', models);
  });

  afterAll(() => db.dropAllSchemas());

  it('findAvailableHost shoud select available host', async () =>
    expect(Hosts.findAvailableHost()).resolves.toMatchObject({ id: 4 }));

  it('getOne should return result', () =>
    expect(Hosts.getOne(1)).resolves.toBeDefined());

  it('Should upsert host', async () => {
    const newId = 5;
    const file = await Hosts.upsert(newId);
    expect(file.dataValues).toMatchObject({
      id: newId,
    });
  });
});
