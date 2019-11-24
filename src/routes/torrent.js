const Router = require('koa-router');

const HttpError = require('../errors/httpError');
const authenticated = require('../middlewares/authenticated');
const Roles = require('../services/roles');
const TorrentsService = require('../services/torrents');
const {
  normalize: normalizeTorrent,
} = require('../services/normalizers/torrents');
const transmission = require('../services/transmission');
const getRessource = require('../middlewares/getRessource');

const router = new Router();
const checkAuthenticated = authenticated();
const checkRoleUploader = authenticated({
  role: Roles.ROLE_UPLOADER,
  fetchUser: true,
});

const getTorrentMiddleware = getRessource(TorrentsService.get, 'params.hash');
const assertOwner = async (ctx, next) => {
  if (!TorrentsService.isOwner(ctx.state.entity, ctx.state.user)) {
    throw new HttpError(403, 'Invalid owner');
  }
  return next();
};

router.post(
  '/pause',
  checkRoleUploader,
  getTorrentMiddleware,
  assertOwner,
  async ctx => {
    const { entity: torrent } = ctx.state;
    const host = await torrent.getHost();
    await transmission.pause(torrent.hash, host);
    ctx.body = true;
  },
);

router.post(
  '/start',
  checkRoleUploader,
  getTorrentMiddleware,
  assertOwner,
  async ctx => {
    const { entity: torrent } = ctx.state;
    const host = await torrent.getHost();
    await transmission.start(torrent.hash, host);
    ctx.body = true;
  },
);

router.delete(
  '/',
  checkRoleUploader,
  getTorrentMiddleware,
  assertOwner,
  async ctx => {
    const { entity: torrent } = ctx.state;
    const host = await torrent.getHost();
    await transmission.remove(torrent.hash, host);
    ctx.body = true;
  },
);

router.get('/', checkAuthenticated, getTorrentMiddleware, async ctx => {
  const { entity: torrent } = ctx.state;
  const host = await torrent.getHost();
  const files = await torrent.getFiles();
  const user = await torrent.getUser();

  ctx.body = normalizeTorrent(
    {
      ...torrent.dataValues,
      files,
      user: user ? user.dataValues : null,
    },
    host,
  );
});

module.exports = router;
