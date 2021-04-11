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

router.get(
  '/tv',
  authenticated(),
  joi(Joi.object({ query: Joi.string().required() }), 'request.query'),
  async ctx => {
    const { query } = ctx.request.query;
    ctx.body = await Metadata.searchTv(query);
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
  '/files/movie/:file([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  authenticated({ fetchUser: true }),
  getFileMiddleware,
  assertIsOwner,
  joi(
    Joi.object({
      movieId: Joi.alternatives(Joi.string(), Joi.number()).required(),
    }).required(),
  ),
  async ctx => {
    const { entity: file } = ctx.state;
    const { movieId } = ctx.request.body;

    ctx.body = await Metadata.assignMovie(file, movieId);
  },
);

router.post(
  '/files/tv/:tvId([0-9]+)',
  authenticated({ fetchUser: true }),
  joi(
    Joi.array()
      .items(
        Joi.object({
          fileId: Joi.string()
            .guid({ version: ['uuidv4'] })
            .required(),
          episodeNumber: Joi.alternatives(
            Joi.string(),
            Joi.number(),
          ).required(),
          seasonNumber: Joi.alternatives(Joi.string(), Joi.number()).required(),
        }),
      )
      .min(1)
      .max(50)
      .required(),
  ),
  async ctx => {
    const items = ctx.request.body;
    const { user } = ctx.state;
    const { tvId } = ctx.params;

    ctx.body = await items.reduce(
      async (prev, { fileId, episodeNumber, seasonNumber }) => {
        const results = await prev;
        const file = await Files.get(fileId, 'torrent');

        if (!file) {
          results.push({ fileId, success: false });
          return results;
        }

        if (!TorrentsService.isOwner(file.torrent, user)) {
          throw new HttpError(403, `Invalid owner for file ${fileId}`);
        }

        results.push({
          fileId: file.id,
          success: await Metadata.assignTv(
            file,
            tvId,
            seasonNumber,
            episodeNumber,
          ),
        });

        return results;
      },
      Promise.resolve([]),
    );
  },
);

module.exports = router;
