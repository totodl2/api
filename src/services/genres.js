const { Genre, sequelize, Sequelize } = require('../models');

const { QueryTypes } = Sequelize;

module.exports = {
  /**
   * @param {Number} id
   * @param {Array<String>|String} [include] included relations
   * @return {Promise<Genre | null>}
   */
  get: (id, include) => Genre.findOne({ where: { id }, include }),

  /**
   * @param {string} name
   * @param [transaction]
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

  /**
   * @return {Promise<Array<{id:Number,name:String,count:Number}>>}
   */
  getAll: async () =>
    sequelize.query(
      `
      SELECT mg."genreId" as "id",
             g."name" as "name",
             COUNT(mg."movieId") as "count"
      FROM "MovieGenres" mg
          LEFT JOIN "Genres" g
      ON g.id = mg."genreId"
      GROUP BY mg."genreId", g."name"
      ORDER BY COUNT (mg."movieId") DESC;
    `,
      { type: QueryTypes.SELECT },
    ),
};
