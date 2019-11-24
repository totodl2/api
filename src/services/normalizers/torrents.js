const { normalizeShort: normalizeUser } = require('./users');
const { normalize: normalizeFiles } = require('./files');

/**
 * @param torrent
 * @param {Host|null} host
 * @returns {{user: (*|null)}}
 */
const normalizeOne = (torrent, host) => ({
  ...torrent,
  files: torrent.files ? normalizeFiles(torrent.files, host) : [],
  user: torrent.user ? normalizeUser(torrent.user) : null,
});

/**
 * @param {Array<Torrent>|Torrent} torrents
 * @param {Host|null} host
 * @returns {Array<Object>|Object}
 */
const normalize = function normalize(torrents, host = null) {
  if (!Array.isArray(torrents)) {
    return normalizeOne(torrents, host);
  }
  return torrents.map(torrent => normalizeOne(torrent, host));
};

module.exports = { normalizeOne, normalize };
