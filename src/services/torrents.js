const { Torrent } = require('../models');
const DuplicatedTorrent = require('../errors/duplicatedTorrent');
const Roles = require('./roles');

module.exports = {
  /**
   * Get one torrent by his hash
   * @param {string} hash
   * @returns {Promise<Torrent|null>}
   */
  get: hash => Torrent.findOne({ where: { hash }, include: 'user' }),
  /**
   * Upsert torrent
   * @param {Object} data
   * @param {Boolean} [verifyUser] Try to assign user
   * @returns {Promise<Torrent>}
   */
  upsert: async function create(data, verifyUser = false) {
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
   * @param {Torrent} torrent
   * @param {User} user
   * @returns {Boolean}
   */
  isOwner: (torrent, user) =>
    user &&
    (Roles.hasRole(user.roles, Roles.ROLE_ADMIN) || torrent.userId === user.id),
};
