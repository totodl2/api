// eslint-disable-next-line import/no-extraneous-dependencies
import fixtures from 'sequelize-fixtures';
import Hosts from './hosts';
import { sequelize, repositories } from '../models';

describe('Hosts', () => {
  beforeAll(async () => {
    await sequelize.sync();
    await fixtures.loadFile('fixtures/hosts.js', repositories);
  });

  afterAll(() => sequelize.dropAllSchemas({}));

  it('findAvailableHost shoud select available host', async () =>
    expect(Hosts.findAvailableHost()).resolves.toMatchObject({ id: 4 }));

  it('getOne should return result', () =>
    expect(Hosts.getOne(1)).resolves.toBeDefined());

  it('Should upsert host', async () => {
    const newId = 5;
    const host = await Hosts.upsert(newId);
    expect(host.dataValues).toMatchObject({
      id: newId,
    });
  });

  it('should update host uploaded at', async () => {
    const host = await Hosts.getOne(1);
    host!.set('lastUploadAt', null);
    await Hosts.markNewUpload(host!, null!);
    expect(host!.lastUploadAt).toBeDefined();
  });
});
