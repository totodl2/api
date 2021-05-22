import { Includeable, Transaction, QueryTypes } from 'sequelize';
import { GenreAttributes, GenreInstance } from '../models/genres';

import { Genre, sequelize } from '../models';
import { AddIncludedTypesTo } from '../models/types';

const GenresService = {
  get: <IncludeTypes extends {} = {}>(
    id: number,
    include?: Includeable | Includeable[],
  ) =>
    Genre.findOne({ where: { id }, include }) as Promise<AddIncludedTypesTo<
      GenreInstance,
      IncludeTypes
    > | null>,

  findOrCreate: async (name: string, transaction?: Transaction | null) => {
    const [file] = await Genre.findOrCreate({
      where: { name },
      defaults: { name },
      transaction,
    });
    return file;
  },

  /**
   * Get all genres for movies
   */
  getAllForMovies: async () =>
    sequelize.query<GenreAttributes & { count: number }>(
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

  /**
   * Get all genre for tv shows
   */
  getAllForTv: async () =>
    sequelize.query<GenreAttributes & { count: number }>(
      `
      SELECT mg."genreId" as "id",
             g."name" as "name",
             COUNT(mg."tvId") as "count"
      FROM "TvGenres" mg
          LEFT JOIN "Genres" g
      ON g.id = mg."genreId"
      GROUP BY mg."genreId", g."name"
      ORDER BY COUNT (mg."tvId") DESC;
    `,
      { type: QueryTypes.SELECT },
    ),
};

export default GenresService;
module.exports = GenresService; // @todo : remove me
