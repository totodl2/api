const Genres = require('./genres');
const { Movie, sequelize, Sequelize } = require('../models');

const { QueryTypes, Op } = Sequelize;

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

  /**
   * @param {number} genreId
   * @param {number} limit
   * @return {Promise<Movie[]>}
   */
  getLast: async ({ genreId = null, limit = 12 } = {}) => {
    let results = [];

    if (genreId) {
      results = await sequelize.query(
        `
        SELECT f."movieId",
               MAX(f."createdAt") as "createdAt"
        FROM "Files" f
                 LEFT JOIN "MovieGenres" mg ON mg."movieId" = f."movieId"
        WHERE f."movieId" IS NOT NULL
          AND mg."genreId" = ?
        GROUP BY f."movieId"
        ORDER BY MAX(f."createdAt") DESC
        LIMIT ?
      `,
        {
          replacements: [genreId, limit],
          type: QueryTypes.SELECT,
        },
      );
    } else {
      results = await sequelize.query(
        `
        SELECT f."movieId",
               MAX(f."createdAt") as "createdAt"
        FROM "Files" f
        WHERE f."movieId" IS NOT NULL
        GROUP BY f."movieId"
        ORDER BY MAX(f."createdAt") DESC
        LIMIT ?
      `,
        {
          replacements: [limit],
          type: QueryTypes.SELECT,
        },
      );
    }

    const orders = results.reduce(
      (prev, result) => ({
        ...prev,
        [result.movieId]: result.createdAt,
      }),
      {},
    );

    const movies = await Movie.findAll({
      where: { id: { [Op.in]: results.map(result => result.movieId) } },
    });

    return movies.sort(
      (movieA, movieB) => orders[movieB.id] - orders[movieA.id],
    );
  },
};
