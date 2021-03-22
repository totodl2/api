const { Genre } = require('../models');

module.exports = {
  /**
   * @param {string} name
   * @param transaction
   * @return {Promise<*>}
   */
  findOrCreate: async (name, transaction) => {
    const [file] = await Genre.findOrCreate({
      where: { name },
      defaults: { name },
      transaction,
    });
    return file;
  },
};
