const Genres = require('./genres');
const { Movie, sequelize } = require('../models');

module.exports = {
  /**
   * @param {Number} id
   * @param {Array<String>|String} include included relations
   * @return {Promise<Movie | null>}
   */
  get: (id, include) => Movie.findOne({ where: { id }, include }),
  /**
   * @param {Array<{name: string}>} genres
   * @param {*} data
   * @return {Promise<Movie>}
   */
  create: async ({ genres = [], ...data }) => {
    const transaction = await sequelize.transaction();
    try {
      const movie = await Movie.create({ ...data }, { transaction });

      for (let i = 0, sz = genres.length; i < sz; i++) {
        await movie.addGenre(
          await Genres.findOrCreate(genres[i].name, transaction),
          { transaction },
        );
      }

      await transaction.commit();

      movie.genres = await movie.getGenres();
      return movie;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },
};
