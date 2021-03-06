const Router = require('koa-router');
const Joi = require('@hapi/joi');
const joi = require('../middlewares/joi');
const Tv = require('../services/tv');
const Genres = require('../services/genres');
const WatchStatus = require('../services/watchStatus');
const getRessource = require('../middlewares/getRessource');
const authenticated = require('../middlewares/authenticated');
const { normalize, normalizeShort } = require('../services/normalizers/tv');

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
  } = ctx.state;
  const { genres = [], files: ignoredFiles, ...tv } = entity.dataValues;
  const files = await entity.getFiles({ include: ['host', 'torrent'] });
  const status = await WatchStatus.findForTv(userId, tv.id);

  ctx.body = normalize({
    ...tv,
    genres: genres.map(genre => genre.dataValues),
    files: (files || []).map(file => file.dataValues),
    watchStatus: status.map(watchStatus => watchStatus.dataValues),
  });
});

const renderTvPage = async (genre, from, limit = 54) => {
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
    const { from = 0 } = ctx.query || {};
    ctx.body = await renderTvPage(null, from);
  },
);

router.get(
  '/genres/:id([0-9]+)',
  joi(Joi.object({ from: Joi.number().min(0) }), 'request.query'),
  getRessource(id => Genres.get(id), 'params.id'),
  async ctx => {
    const { entity: genre } = ctx.state;
    const { from = 0 } = ctx.query || {};
    ctx.body = await renderTvPage(genre, from);
  },
);

module.exports = router;
