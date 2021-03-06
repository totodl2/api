const path = require('path');
const createLink = require('../../utils/createCdnLink');
const createVodCdnLink = require('../../utils/createVodCdnLink');

const normalizeTranscoded = file => {
  const { transcoded } = file;
  if (!transcoded) {
    return null;
  }

  const basename = path.basename(file.name, path.extname(file.name));
  return transcoded.map(({ type, title: preset, lang, filename }) => {
    if (type === 'media') {
      return {
        type,
        preset,
        url: createVodCdnLink.download(file.id, filename, basename),
      };
    }
    return {
      type,
      title: preset,
      lang,
      url: createVodCdnLink.download(file.id, filename, basename),
    };
  });
};

const createVodUrl = file => {
  const { transcoded } = file;
  if (!transcoded) {
    return null;
  }

  const presets = transcoded
    .filter(el => el.type === 'media')
    .map(el => el.title);

  return createVodCdnLink.stream(file.id, presets);
};

/**
 * @param {File} files
 * @param {Host} host
 * @returns {string}
 */
const createUrl = (file, host) =>
  createLink(file.id, file.name, host.cdnUrl || '', host.cdnSecret || '');

/**
 * Normalize file
 * @param {File} files
 * @param {Host} host
 * @returns {Object}
 */
const normalizeOne = ({ host: fileHost, torrent, ...file }, host) => {
  if (file.bytesCompleted === file.length) {
    const finalHost = fileHost || host || {};
    const output = {
      ...file,
      transcoded: normalizeTranscoded(file),
      url: createUrl(file, finalHost),
      vodUrl: createVodUrl(file),
    };

    if (torrent && torrent.userId) {
      output.userId = torrent.userId;
    }

    return output;
  }
  return file;
};

/**
 * Normalize array of files
 * @param {Array<File>|File} files
 * @param {Host} [host]
 * @returns {Array<Object>}
 */
const normalize = (files, host) => {
  if (!Array.isArray(files)) {
    return normalizeOne(files, host);
  }
  return files.map(file => normalizeOne(file, host));
};

module.exports = { normalize, createUrl };
