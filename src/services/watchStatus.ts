import { WatchStatus } from '../models';
import { FileAttributes } from '../models/files';
import { WatchStatusAttributes } from '../models/watch-status';
import { Defined } from '../types/TypesHelper';

const WatchStatusService = {
  /**
   * Find watch status for user and file
   */
  find: (userId: number, file: FileAttributes) => {
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
   */
  findForTv: (userId: number, tvId: number) =>
    WatchStatus.findAll({
      where: { userId, tvId },
      order: [['seasonNumber', 'ASC'], ['episodeNumber', 'ASC']],
    }),

  /**
   * Find watch status for given movie id & userId
   */
  findForMovie: (userId: number, movieId: number) =>
    WatchStatus.findOne({ where: { userId, movieId } }),

  /**
   * Find watch status for movies list
   */
  findForMovies: (userId: number, moviesId: number[]) =>
    WatchStatus.findAll({ where: { userId, movieId: moviesId } }),

  /**
   * Upsert watch status position
   * @param userId
   * @param file
   * @param position
   * @param length
   * @returns {Promise<WatchStatus>}
   */
  upsert: async (
    userId: number,
    file: FileAttributes,
    {
      position,
      length,
    }: Partial<Pick<WatchStatusAttributes, 'position' | 'length'>> = {},
  ) => {
    const data: Defined<Partial<WatchStatusAttributes>, 'userId'> = { userId };
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

module.exports = WatchStatusService; // @todo : remove me
export default WatchStatusService;
