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
};
