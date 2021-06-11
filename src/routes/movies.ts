/* eslint require-atomic-updates: 0 */

import Router from 'koa-router';
import Joi from '@hapi/joi';
import joi from '../middlewares/joi';
import Movies from '../services/movies';
import Genres from '../services/genres';
import WatchStatus from '../services/watchStatus';
import { normalize as normalizeWatchStatus } from '../services/normalizers/watchStatus';
import getRessource from '../middlewares/getRessource';
import authenticated from '../middlewares/authenticated';
import { normalize, normalizeShort } from '../services/normalizers/movies';
import { MovieInstance } from '../models/movies';
import { GenreAttributes, GenreInstance } from '../models/genres';
import { AddIncludedTypesTo } from '../models/types';
import { JwtType } from '../services/jwt';

const router = new Router();
router.use(authenticated());

const getMovieMiddleware = getRessource(
  id =>
    Movies.get(id, [
      'genres',
      // { model: File, as: 'files', include: ['host', 'torrent'] },
    ]),
  'params.id',
);

router.get('/:id([0-9]+)', getMovieMiddleware, async ctx => {
  const {
    entity,
    jwt: { id: userId },
  } = ctx.state as {
    entity: AddIncludedTypesTo<MovieInstance, { genres: GenreInstance[] }>;
    jwt: JwtType;
  };
  const { genres = [], ...movie } = entity.dataValues;
  const files = await entity.getFiles({ include: ['host', 'torrent'] });
  const watchStatus = await WatchStatus.findForMovie(userId, movie.id);

  ctx.body = normalize({
    ...movie,
    genres: genres.map(genre => genre.dataValues),
    files: (files || []).map(file => file.dataValues),
    watchStatus: watchStatus ? watchStatus.dataValues : null,
  });
});

const renderMoviesPage = async (
  userId: number,
  genre?: GenreAttributes | null,
  from?: number,
  limit = 54,
) => {
  const genres = await Genres.getAllForMovies();
  const movies = await Movies.getLast({
    genreId: genre ? genre.id : null,
    from,
    limit,
  });
  const seen = await WatchStatus.findForMovies(
    userId,
    movies.map(movie => movie.id),
  );

  return {
    genres,
    data: normalizeShort(movies),
    watchStatus: seen.map(ws => normalizeWatchStatus(ws.dataValues)),
  };
};

router.get(
  '/',
  joi(Joi.object({ from: Joi.number().min(0) }), 'request.query'),
  async ctx => {
    const { from } = ctx.query as { from?: string };
    const {
      jwt: { id: userId },
    } = ctx.state as { jwt: JwtType };
    ctx.body = await renderMoviesPage(
      userId,
      null,
      from ? parseInt(from, 10) : 0,
    );
  },
);

router.get(
  '/genres/:id([0-9]+)',
  joi(Joi.object({ from: Joi.number().min(0) }), 'request.query'),
  getRessource(id => Genres.get(id), 'params.id'),
  async ctx => {
    const {
      entity: genre,
      jwt: { id: userId },
    } = ctx.state as { entity: GenreInstance; jwt: JwtType };
    const { from } = ctx.query as { from?: string };
    ctx.body = await renderMoviesPage(
      userId,
      genre,
      from ? parseInt(from, 10) : 0,
    );
  },
);

export default router;
