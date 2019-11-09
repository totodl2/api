const { Torrent } = require('../models');
const DuplicatedTorrent = require('../errors/duplicatedTorrent');

module.exports = {
  get: hash => Torrent.findOne({ where: { hash } }),
  upsert: async function create(data, verifyUser = false) {
    const [torrent, isNewRecord] = await Torrent.findOrBuild({
      where: { hash: data.hash },
      defaults: data,
    });

    if (verifyUser && torrent.userId && torrent.userId !== data.userId) {
      throw new DuplicatedTorrent('Cannot re-assign user');
    }

    if (!isNewRecord) {
      await torrent.update(data, { validate: false });
    }

    return torrent;
  },
};
