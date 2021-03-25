const { normalizeShort: normalizeUser } = require('./users');
const { normalize: normalizeFiles } = require('./files');

/**
 * @param torrent
 * @param {Host|null} host
 * @returns {Object}
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
const normalize = (torrents, host = null) => {
  if (!Array.isArray(torrents)) {
    return normalizeOne(torrents, host);
  }
  return torrents.map(torrent => normalizeOne(torrent, host));
};

/**
 * @param {Torrent} torrent
 * @return {Object}
 */
const normalizeOneShort = ({ files, user, ...torrent }) => ({
  ...torrent,
  user: user ? normalizeUser(user) : null,
});

/**
 * @param {Array<Torrent>|Torrent} torrents
 * @returns {Array<Object>|Object}
 */
const normalizeShort = torrents => {
  if (!Array.isArray(torrents)) {
    return normalizeOneShort(torrents);
  }
  return torrents.map(torrent => normalizeOneShort(torrent));
};

module.exports = { normalize, normalizeShort };
