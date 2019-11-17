const { File } = require('../models');

module.exports = {
  /**
   * Get one file by his hash
   * @param {string} id uuidv4
   * @returns {Promise<File|null>}
   */
  get: id => File.findOne({ where: { id } }),
  /**
   * Upsert file
   * @param {Object} data
   * @returns {Promise<File>}
   */
  upsert: async function create(data) {
    const [file, isNewRecord] = await File.findOrCreate({
      where: { id: data.id },
      defaults: data,
    });

    if (!isNewRecord) {
      await file.update(data);
    }

    return file;
  },
  /**
   * Normalize file
   * @param {File} files
   * @param {Host} host
   * @returns {Object}
   */
  normalizeOne: (file, host) => file, // eslint-disable-line
  /**
   * Normalize array of files
   * @param {Array<File>|File} files
   * @param {Host} host
   * @returns {Array<Object>}
   */
  normalize: function normalize(files, host) {
    if (!Array.isArray(files)) {
      return this.normalizeOne(files);
    }
    return files.map(file => this.normalizeOne(file, host));
  },
};
