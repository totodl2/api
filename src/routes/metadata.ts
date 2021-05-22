import Router from 'koa-router';
import Joi from '@hapi/joi';
import { Context, Next } from 'koa';

import Files from '../services/files';
import joi from '../middlewares/joi';
import Metadata from '../services/metadata';
import authenticated from '../middlewares/authenticated';
import HttpError from '../errors/httpError';
import getRessource from '../middlewares/getRessource';
import TorrentsService from '../services/torrents';
import { UserInstance } from '../models/users';
import { TorrentInstance } from '../models/torrents';

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
    const { query } = ctx.request.query as { query: string };
    ctx.body = await Metadata.searchMovie(query);
  },
);

router.get(
  '/tv',
  authenticated(),
  joi(Joi.object({ query: Joi.string().required() }), 'request.query'),
  async ctx => {
    const { query } = ctx.request.query as { query: string };
    ctx.body = await Metadata.searchTv(query);
  },
);

const getFileMiddleware = getRessource(
  id => Files.get(id, 'torrent'),
  'params.file',
);

const assertIsOwner = async (ctx: Context, next: Next) => {
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
    const job = await Metadata.assignMovie(file.id, movieId);
    ctx.body = !!job;
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
    const items = ctx.request.body as {
      fileId: string;
      episodeNumber: number | string;
      seasonNumber: number | string;
    }[];
    const { user } = ctx.state as { user: UserInstance };
    const { tvId } = ctx.params;

    ctx.body = await items.reduce<
      Promise<{ fileId: string; success: boolean }[]>
    >(async (prev, { fileId, episodeNumber, seasonNumber }) => {
      const results = await prev;
      const file = await Files.get<{ torrent: TorrentInstance }>(
        fileId,
        'torrent',
      );

      if (!file) {
        results.push({ fileId, success: false });
        return results;
      }

      if (!TorrentsService.isOwner(file.torrent, user)) {
        throw new HttpError(403, `Invalid owner for file ${fileId}`);
      }

      results.push({
        fileId: file.id,
        success: !!(await Metadata.assignTv(
          file.id,
          parseInt(tvId, 10),
          typeof seasonNumber === 'string'
            ? parseInt(seasonNumber, 10)
            : seasonNumber,
          typeof episodeNumber === 'string'
            ? parseInt(episodeNumber, 10)
            : episodeNumber,
        )),
      });

      return results;
    }, Promise.resolve([]));
  },
);

module.exports = router; // @todo remove me
export default router;
