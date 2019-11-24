/**
 * Normalize file
 * @param {File} files
 * @param {Host} host
 * @returns {Object}
 */
const normalizeOne = (file, host) => file; // eslint-disable-line
/**
 * Normalize array of files
 * @param {Array<File>|File} files
 * @param {Host} host
 * @returns {Array<Object>}
 */
const normalize = (files, host) => {
  if (!Array.isArray(files)) {
    return normalizeOne(files);
  }
  return files.map(file => normalizeOne(file, host));
};

module.exports = { normalize, normalizeOne };
