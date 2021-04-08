const Genres = require('./genres');
const { Tv, sequelize, Sequelize } = require('../models');

const { QueryTypes, Op } = Sequelize;

module.exports = {
  /**
   * @param {Number} id
   * @param {Array<String>|String} [include] included relations
   * @return {Promise<Tv | null>}
   */
  get: (id, include) => Tv.findOne({ where: { id }, include }),

  /**
   * @param {Array<{name: string}>} genres
   * @param {*} data
   * @return {Promise<Tv>}
   */
  create: async ({ genres = [], ...data }) => {
    const transaction = await sequelize.transaction();
    try {
      const tv = await Tv.create({ ...data }, { transaction });

      for (let i = 0, sz = genres.length; i < sz; i++) {
        await tv.addGenre(
          await Genres.findOrCreate(genres[i].name, transaction),
          { transaction },
        );
      }

      await transaction.commit();

      tv.genres = await tv.getGenres();
      return tv;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  /**
   * @param {Tv} tvModel
   * @param {Array<{name: string}>} genres
   * @param {int|string} id
   * @param {*} data
   * @returns {Promise<Tv>}
   */
  update: async (tv, { genres = [], id, ...data }) => {
    const transaction = await sequelize.transaction();
    try {
      const newGenres = [];
      for (let i = 0, sz = genres.length; i < sz; i++) {
        newGenres.push(await Genres.findOrCreate(genres[i].name, transaction));
      }

      await tv.setGenres(newGenres, { transaction });
      await tv.update(data, { transaction });
      await transaction.commit();

      // eslint-disable-next-line no-param-reassign
      tv.genres = await tv.getGenres();
      return tv;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  /**
   * @param {Tv|{seasons:{seasonNumber:number,episodes:{episodeNumber:number}[]}[]}} tv
   * @param {number} seasonNumber
   * @returns {boolean}
   */
  hasEpisode: (tv, seasonNumber, episodeNumber) => {
    const { seasons } = tv;
    return !!seasons.find(season => {
      if (season.seasonNumber !== seasonNumber) {
        return false;
      }
      return season.episodes.find(
        episode => episode.episodeNumber === episodeNumber,
      );
    });
  },

  /**
   * @param {number|null} [genreId]
   * @param {number} [limit]
   * @param {number} [from]
   * @return {Promise<Tv[]>}
   */
  getLast: async ({ genreId = null, from = 0, limit = 12 } = {}) => {
    let results = [];

    if (genreId) {
      results = await sequelize.query(
        `
        SELECT f."tvId",
               MAX(f."createdAt") as "createdAt"
        FROM "Files" f
                 LEFT JOIN "TvGenres" mg ON mg."tvId" = f."tvId"
        WHERE f."tvId" IS NOT NULL
          AND mg."genreId" = ?
        GROUP BY f."tvId"
        ORDER BY MAX(f."createdAt") DESC
        LIMIT ? OFFSET ?
      `,
        {
          replacements: [genreId, limit, from],
          type: QueryTypes.SELECT,
        },
      );
    } else {
      results = await sequelize.query(
        `
        SELECT f."tvId",
               MAX(f."createdAt") as "createdAt"
        FROM "Files" f
        WHERE f."tvId" IS NOT NULL
        GROUP BY f."tvId"
        ORDER BY MAX(f."createdAt") DESC
        LIMIT ? OFFSET ?
      `,
        {
          replacements: [limit, from],
          type: QueryTypes.SELECT,
        },
      );
    }

    const orders = results.reduce(
      (prev, result) => ({
        ...prev,
        [result.tvId]: result.createdAt,
      }),
      {},
    );

    const tv = await Tv.findAll({
      where: { id: { [Op.in]: results.map(result => result.tvId) } },
    });

    return tv.sort((tvA, tvB) => orders[tvA.id] - orders[tvB.id]);
  },
};
