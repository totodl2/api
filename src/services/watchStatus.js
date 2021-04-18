const { WatchStatus } = require('../models');

module.exports = {
  /**
   * @param {Number} userId
   * @param {File} file
   * @returns {Promise<WatchStatus|null>}
   */
  find: (userId, file) => {
    if (file.tvId) {
      return WatchStatus.findOne({
        where: {
          userId,
          tvId: file.tvId,
          episodeNumber: file.episodeNumber,
          seasonNumber: file.seasonNumber,
        },
      });
    }

    if (file.movieId) {
      return WatchStatus.findOne({ where: { userId, movieId: file.movieId } });
    }

    return WatchStatus.findOne({ where: { userId, fileId: file.id } });
  },

  /**
   * Find last tv item seen
   * @param {number} userId
   * @param {number} tvId
   * @returns {Promise<WatchStatus[]>}
   */
  findForTv: (userId, tvId) =>
    WatchStatus.findAll({
      where: { userId, tvId },
      order: [['seasonNumber', 'ASC'], ['episodeNumber', 'ASC']],
    }),

  /**
   * @param {number} userId
   * @param {number} movieId
   * @returns {Promise<WatchStatus | null>}
   */
  findForMovie: (userId, movieId) =>
    WatchStatus.findOne({ where: { userId, movieId } }),

  /**
   * @param {number} userId
   * @param {number[]} moviesId
   * @returns {Promise<WatchStatus[]>}
   */
  findForMovies: (userId, moviesId) =>
    WatchStatus.findAll({ where: { userId, movieId: moviesId } }),

  /**
   * @param {number} userId
   * @param {File} file
   * @param {number} position
   * @param {number} length
   * @returns {Promise<WatchStatus>}
   */
  upsert: async (userId, file, { position, length } = {}) => {
    const data = { userId };
    if (file.tvId) {
      data.tvId = file.tvId;
      data.seasonNumber = file.seasonNumber;
      data.episodeNumber = file.episodeNumber;
    } else if (file.movieId) {
      data.movieId = file.movieId;
    } else {
      data.fileId = file.id;
    }

    const [status, isNewRecord] = await WatchStatus.findOrCreate({
      where: data,
      defaults: { ...data, position, length },
    });

    if (!isNewRecord) {
      await status.update({ position, length });
    }

    return status;
  },
};
