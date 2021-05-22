import { Torrent } from '../models';
import DuplicatedTorrent from '../errors/duplicatedTorrent';
import { Roles, hasRole } from './roles';
import {
  CreateTorrentAttributes,
  TorrentAttributes,
  TorrentInstance,
} from '../models/torrents';
import { UserAttributes } from '../models/users';

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
};

module.exports = TorrentsService; // @todo: remove me
export default TorrentsService;
