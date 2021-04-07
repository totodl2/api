const Genres = require('./genres');
const { Tv, sequelize } = require('../models');

module.exports = {
  /**
   * @param {Number} id
   * @param {Array<String>|String} [include] included relations
   * @return {Promise<Movie | null>}
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
};
