import Router from 'koa-router';
import Joi from '@hapi/joi';
import joi from '../middlewares/joi';
import Tv from '../services/tv';
import Genres from '../services/genres';
import WatchStatus from '../services/watchStatus';
import getRessource from '../middlewares/getRessource';
import authenticated from '../middlewares/authenticated';
import { normalize, normalizeShort } from '../services/normalizers/tv';
import { TvInstance } from '../models/tv';
import { JwtType } from '../services/jwt';
import { AddIncludedTypesTo } from '../models/types';
import { GenreAttributes, GenreInstance } from '../models/genres';

const router = new Router();
router.use(authenticated());

const getTvMiddleware = getRessource(
  id =>
    Tv.get(id, [
      'genres',
      // { model: File, as: 'files', include: ['host', 'torrent'] },
    ]),
  'params.id',
);

router.get('/:id([0-9]+)', getTvMiddleware, async ctx => {
  const {
    entity,
    jwt: { id: userId },
  } = ctx.state as {
    entity: AddIncludedTypesTo<TvInstance, { genres: GenreInstance[] }>;
    jwt: JwtType;
  };
  const { genres = [], ...tv } = entity.dataValues;
  const files = await entity.getFiles({ include: ['host', 'torrent'] });
  const status = await WatchStatus.findForTv(userId, tv.id);

  ctx.body = normalize({
    ...tv,
    genres: genres.map(genre => genre.dataValues),
    files: (files || []).map(file => file.dataValues),
    watchStatus: status.map(watchStatus => watchStatus.dataValues),
  });
});

const renderTvPage = async (
  genre?: GenreAttributes | null,
  from?: number,
  limit = 54,
) => {
  const genres = await Genres.getAllForTv();
  return {
    genres,
    data: normalizeShort(
      await Tv.getLast({ genreId: genre ? genre.id : null, from, limit }),
    ),
  };
};

router.get(
  '/',
  joi(Joi.object({ from: Joi.number().min(0) }), 'request.query'),
  async ctx => {
    const { from } = ctx.query as { from?: string };
    ctx.body = await renderTvPage(null, from ? parseInt(from, 10) : 0);
  },
);

router.get(
  '/genres/:id([0-9]+)',
  joi(Joi.object({ from: Joi.number().min(0) }), 'request.query'),
  getRessource(id => Genres.get(id), 'params.id'),
  async ctx => {
    const { entity: genre } = ctx.state as { entity: GenreInstance };
    const { from } = ctx.query as { from?: string };
    ctx.body = await renderTvPage(genre, from ? parseInt(from, 10) : 0);
  },
);

export default router;
