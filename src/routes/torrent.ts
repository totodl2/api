import Router from 'koa-router';
import { Context, Next } from 'koa';

import HttpError from '../errors/httpError';
import authenticated from '../middlewares/authenticated';
import { Roles, hasRole } from '../services/roles';
import TorrentsService from '../services/torrents';
import { normalize as normalizeTorrent } from '../services/normalizers/torrents';
import transmission from '../services/transmission';
import getRessource from '../middlewares/getRessource';
import { TorrentInstance } from '../models/torrents';
import { UserInstance } from '../models/users';
import { JwtType } from '../services/jwt';

const router = new Router();
const checkAuthenticated = authenticated();
const checkRoleUploader = authenticated({
  role: Roles.ROLE_UPLOADER,
  fetchUser: true,
});

const getTorrentMiddleware = getRessource(TorrentsService.get, 'params.hash');

const assertOwner = async (ctx: Context, next: Next) => {
  const { entity, user } = ctx.state as {
    entity: TorrentInstance;
    user: UserInstance;
  };
  if (!TorrentsService.isOwner(entity, user)) {
    throw new HttpError(403, 'Invalid owner');
  }
  return next();
};

const canStartPause = async (ctx: Context, next: Next) => {
  const { entity: torrent, jwt } = ctx.state as {
    entity: TorrentInstance;
    jwt: JwtType;
  };

  if (torrent.isFinished && !hasRole(jwt.roles, Roles.ROLE_ADMIN)) {
    throw new HttpError(403, 'User cannot start torrent');
  }

  return next();
};

router.post(
  '/pause',
  checkRoleUploader,
  getTorrentMiddleware,
  assertOwner,
  canStartPause,
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
  canStartPause,
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
  const { entity: torrent } = ctx.state as { entity: TorrentInstance };
  const host = await torrent.getHost();
  const files = await torrent.getFiles();
  const user = await torrent.getUser();

  ctx.body = normalizeTorrent(
    {
      ...torrent.dataValues,
      files: files.map(f => f.dataValues),
      user: user ? user.dataValues : null,
    },
    host,
  );
});

module.exports = router; // @todo remove me
export default router;
