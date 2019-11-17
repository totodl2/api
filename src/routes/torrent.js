const Router = require('koa-router');

const HttpError = require('../errors/httpError');
const authenticated = require('../middlewares/authenticated');
const Roles = require('../services/roles');
const TorrentService = require('../services/torrents');
const transmission = require('../services/transmission');
const getRessource = require('../middlewares/getRessource');

const router = new Router();
router.use(
  authenticated({
    role: Roles.ROLE_UPLOADER,
    fetchUser: true,
  }),
);

const getTorrentMiddleware = getRessource(TorrentService.get, 'params.hash');
const assertOwner = async (ctx, next) => {
  if (!TorrentService.isOwner(ctx.state.entity, ctx.state.user)) {
    throw new HttpError(403, 'Invalid owner');
  }
  return next();
};

router.post('/pause', getTorrentMiddleware, assertOwner, async ctx => {
  const { entity: torrent } = ctx.state;
  const host = await torrent.getHost();
  await transmission.pause(torrent.hash, host);
  ctx.body = true;
});

router.post('/start', getTorrentMiddleware, assertOwner, async ctx => {
  const { entity: torrent } = ctx.state;
  const host = await torrent.getHost();
  await transmission.start(torrent.hash, host);
  ctx.body = true;
});

router.delete('/', getTorrentMiddleware, assertOwner, async ctx => {
  const { entity: torrent } = ctx.state;
  const host = await torrent.getHost();
  await transmission.remove(torrent.hash, host);
  ctx.body = true;
});

module.exports = router;
