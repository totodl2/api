const createLink = require('../../utils/createCdnLink');

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
