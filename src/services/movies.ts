import { QueryTypes, Op, Includeable } from 'sequelize';
import Genres from './genres';
import { Movie, sequelize } from '../models';
import { CreateMovieAttributes, MovieInstance } from '../models/movies';
import { GenreInstance } from '../models/genres';
import { AddIncludedTypesTo } from '../models/types';

type GetLastQueryResult = {
  movieId: number;
  createdAt: Date;
};

const MoviesService = {
  get: <IncludeTypes extends {} = {}>(
    id: number,
    include?: Includeable | Includeable[],
  ) =>
    Movie.findOne({ where: { id }, include }) as Promise<AddIncludedTypesTo<
      MovieInstance,
      IncludeTypes
    > | null>,

  /**
   * Create a new movie
   */
  create: async ({
    genres = [],
    ...data
  }: CreateMovieAttributes & { genres?: { name: string }[] }) => {
    const transaction = await sequelize.transaction();
    try {
      const movie = (await Movie.create(
        { ...data },
        { transaction },
      )) as MovieInstance & { genres: GenreInstance[] };

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
   * Get last created movies
   */
  getLast: async ({
    genreId = null,
    from = 0,
    limit = 12,
  }: {
    genreId?: number | null;
    from?: number;
    limit?: number;
  } = {}) => {
    let results = [];

    if (genreId) {
      results = await sequelize.query<GetLastQueryResult>(
        `
        SELECT f."movieId",
               MAX(f."createdAt") as "createdAt"
        FROM "Files" f
                 LEFT JOIN "MovieGenres" mg ON mg."movieId" = f."movieId"
        WHERE f."movieId" IS NOT NULL
          AND mg."genreId" = ?
        GROUP BY f."movieId"
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
        SELECT f."movieId",
               MAX(f."createdAt") as "createdAt"
        FROM "Files" f
        WHERE f."movieId" IS NOT NULL
        GROUP BY f."movieId"
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
        [result.movieId]: result.createdAt,
      }),
      {},
    );

    const movies = await Movie.findAll({
      where: { id: { [Op.in]: results.map(result => result.movieId) } },
    });

    movies.sort((movieA, movieB) => orders[movieB.id] - orders[movieA.id]);
    return movies;
  },
};

export default MoviesService;
