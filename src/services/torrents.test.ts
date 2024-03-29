// eslint-disable-next-line import/no-extraneous-dependencies
import fixtures from 'sequelize-fixtures';
import Torrents from './torrents';
import { Roles } from './roles';
import { sequelize, repositories } from '../models';

describe('Torrents', () => {
  beforeAll(async () => {
    await sequelize.sync();
    await fixtures.loadFiles(
      ['fixtures/users.js', 'fixtures/hosts.js', 'fixtures/torrents.js'],
      repositories,
    );
  });

  afterAll(() => sequelize.dropAllSchemas({}));

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

  it('Should detect ownership', () => {
    const torrent = { userId: 1 };

    expect(Torrents.isOwner(torrent, { id: 1, roles: 0 })).toBe(true);
    expect(Torrents.isOwner(torrent, { id: 72, roles: Roles.ROLE_ADMIN })).toBe(
      true,
    );
    expect(
      Torrents.isOwner(torrent, { id: 42, roles: Roles.ROLE_LEECHER }),
    ).toBe(false);
  });
});
