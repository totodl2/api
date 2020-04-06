const path = require('path');
const createLink = require('../../utils/createCdnLink');
const createVodCdnLink = require('../../utils/createVodCdnLink');

const normalizeTranscoded = file => {
  const { transcoded } = file;
  if (!transcoded) {
    return null;
  }

  const basename = path.basename(file.name, path.extname(file.name));
  return transcoded.map(({ type, title: preset, filename }) => ({
    type,
    preset,
    url: createVodCdnLink.download(file.id, filename, basename),
  }));
};

/**
 * Normalize file
 * @param {File} files
 * @param {Host} host
 * @returns {Object}
 */
const normalizeOne = (file, host) => {
  if (file.bytesCompleted === file.length) {
    return {
      ...file,
      transcoded: normalizeTranscoded(file),
      url: createLink(
        file.id,
        file.name,
        host.cdnUrl || '',
        host.cdnSecret || '',
      ),
    };
  }
  return file;
};
/**
 * Normalize array of files
 * @param {Array<File>|File} files
 * @param {Host} host
 * @returns {Array<Object>}
 */
const normalize = (files, host) => {
  if (!Array.isArray(files)) {
    return normalizeOne(files, host);
  }
  return files.map(file => normalizeOne(file, host));
};

module.exports = { normalize, normalizeOne };
