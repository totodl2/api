import { QueryTypes, Op, Includeable } from 'sequelize';
import Genres from './genres';
import { Tv, sequelize } from '../models';
import { CreateTvAttributes, TvAttributes, TvInstance } from '../models/tv';
import { GenreInstance } from '../models/genres';
import { Defined } from '../types/TypesHelper';
import { AddIncludedTypesTo } from '../models/types';

type GetLastQueryResult = {
  tvId: number;
  createdAt: Date;
};

const TvService = {
  get: <IncludeTypes extends {} = {}>(
    id: number,
    include?: Includeable | Includeable[],
  ) =>
    Tv.findOne({ where: { id }, include }) as Promise<AddIncludedTypesTo<
      TvInstance,
      IncludeTypes
    > | null>,

  create: async ({
    genres = [],
    ...data
  }: CreateTvAttributes & { genres?: { name: string }[] }) => {
    const transaction = await sequelize.transaction();
    try {
      const tv = (await Tv.create(
        { ...data },
        { transaction },
      )) as TvInstance & { genres: GenreInstance[] };

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

  update: async (
    tv: TvInstance,
    {
      genres = [],
      id,
      ...data
    }: Defined<CreateTvAttributes, 'id'> & {
      genres?: { name: string }[];
    },
  ) => {
    const transaction = await sequelize.transaction();
    try {
      // /!\ not a copy
      const newTv = tv as TvInstance & { genres: GenreInstance[] };
      const newGenres = [];
      for (let i = 0, sz = genres.length; i < sz; i++) {
        newGenres.push(await Genres.findOrCreate(genres[i].name, transaction));
      }

      await newTv.setGenres(newGenres, { transaction });
      await newTv.update(data, { transaction });
      await transaction.commit();

      // eslint-disable-next-line no-param-reassign
      newTv.genres = await newTv.getGenres();
      return newTv;
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  },

  /**
   * Check if tv has episode
   */
  hasEpisode: (
    tv: Pick<TvAttributes, 'seasons'>,
    seasonNumber: number,
    episodeNumber: number,
  ) => {
    const { seasons } = tv;
    return !!(seasons || []).find(season => {
      if (season.seasonNumber !== seasonNumber) {
        return false;
      }
      return season.episodes.find(
        episode => episode.episodeNumber === episodeNumber,
      );
    });
  },

  /**
   * Get last added tv show
   */
  getLast: async ({
    genreId = null,
    from = 0,
    limit = 12,
  }: { genreId?: number | null; from?: number; limit?: number } = {}) => {
    let results = [];

    if (genreId) {
      results = await sequelize.query<GetLastQueryResult>(
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
      results = await sequelize.query<GetLastQueryResult>(
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

    const orders: { [key: number]: number } = results.reduce(
      (prev, result) => ({
        ...prev,
        [result.tvId]: result.createdAt,
      }),
      {},
    );

    const tv = await Tv.findAll({
      where: { id: { [Op.in]: results.map(result => result.tvId) } },
    });

    tv.sort((tvA, tvB) => orders[tvB.id] - orders[tvA.id]);
    return tv;
  },
};

export default TvService;
