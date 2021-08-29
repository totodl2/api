import { create as createXml } from 'xmlbuilder2';
import { Torrent } from '../models';
import DuplicatedTorrent from '../errors/duplicatedTorrent';
import { Roles, hasRole } from './roles';
import {
  CreateTorrentAttributes,
  TorrentAttributes,
  TorrentInstance,
} from '../models/torrents';
import { UserAttributes } from '../models/users';
import { createUrl } from './normalizers/files';

const TorrentsService = {
  /**
   * Get one torrent by his hash
   */
  get: (hash: string) => Torrent.findOne({ where: { hash }, include: 'user' }),

  /**
   * Upsert torrent
   */
  upsert: async function create(
    data: CreateTorrentAttributes,
    verifyUser = false,
  ) {
    const [torrent, isNewRecord] = await Torrent.findOrCreate({
      where: { hash: data.hash },
      defaults: data,
    });

    if (verifyUser && torrent.userId && torrent.userId !== data.userId) {
      throw new DuplicatedTorrent('Cannot re-assign user');
    }

    if (!isNewRecord) {
      await torrent.update(data);
    }

    return torrent;
  },

  /**
   * Verify if user can edit this torrent
   */
  isOwner: (
    torrent: Pick<TorrentAttributes, 'userId'>,
    user: Pick<UserAttributes, 'id' | 'roles'>,
  ): boolean =>
    !!user &&
    (hasRole(user.roles, Roles.ROLE_ADMIN) || torrent.userId === user.id),

  /**
   * Create metalink XML for given torrent
   */
  createMetaLink: async (torrent: TorrentInstance) => {
    const host = await torrent.getHost();
    const files = await torrent.getFiles();
    const root = createXml({ version: '1.0' })
      .ele('metalink', { xmlns: 'urn:ietf:params:xml:ns:metalink' })
      .ele('published')
      .txt(new Date().toISOString())
      .up();

    files.forEach(file => {
      root
        .ele('file', { name: file.name })
        .ele('size')
        .txt(file.length.toString())
        .up()
        .ele('url', { priority: '1' })
        .txt(createUrl(file, host))
        .up();
    });

    return root.end({ prettyPrint: true });
  },
};

export default TorrentsService;
