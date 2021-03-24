const Router = require('koa-router');
const Joi = require('@hapi/joi');

const Files = require('../services/files');
const joi = require('../middlewares/joi');
const Metadata = require('../services/metadata');
const authenticated = require('../middlewares/authenticated');
const HttpError = require('../errors/httpError');
const getRessource = require('../middlewares/getRessource');
const TorrentsService = require('../services/torrents');

const router = new Router();
router.use(async (ctx, next) => {
  if (!Metadata.enabled) {
    throw new HttpError(503, 'Metadata is disabled');
  }
  return next();
});

router.get('/configuration', authenticated(), async ctx => {
  ctx.body = await Metadata.getConfiguration();
});

router.get(
  '/movies',
  authenticated(),
  joi(Joi.object({ query: Joi.string().required() }), 'request.query'),
  async ctx => {
    const { query } = ctx.request.query;
    ctx.body = await Metadata.searchMovie(query);
  },
);

const getFileMiddleware = getRessource(
  id => Files.get(id, 'torrent'),
  'params.file',
);

const assertIsOwner = async (ctx, next) => {
  if (!TorrentsService.isOwner(ctx.state.entity.torrent, ctx.state.user)) {
    throw new HttpError(403, 'Invalid owner');
  }
  return next();
};

router.del(
  '/files/:file([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  authenticated({ fetchUser: true }),
  getFileMiddleware,
  assertIsOwner,
  async ctx => {
    const { entity: file } = ctx.state;
    ctx.body = await Metadata.remove(file);
  },
);

router.post(
  '/files/:file([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  authenticated({ fetchUser: true }),
  getFileMiddleware,
  assertIsOwner,
  joi(
    Joi.alternatives().try(
      Joi.object({
        movieId: Joi.alternatives(Joi.string(), Joi.number()).required(),
      }),
    ),
  ),
  async ctx => {
    const { entity: file } = ctx.state;
    const { movieId } = ctx.request.body;
    ctx.body = await Metadata.assignMovie(file, movieId);
  },
);

module.exports = router;
