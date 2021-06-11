/* eslint require-atomic-updates: 0 */

import Router from 'koa-router';
import koaBody from 'koa-body';
import Joi from '@hapi/joi';
import get from 'lodash.get';
import { Context } from 'koa';

import { normalizeShort } from '../services/normalizers/torrents';
import { Torrent } from '../models';
import Hosts from '../services/hosts';
import Users from '../services/users';
import HttpError from '../errors/httpError';
import DuplicatedTorrent from '../errors/duplicatedTorrent';
import joi from '../middlewares/joi';
import authenticated from '../middlewares/authenticated';
import { Roles } from '../services/roles';
import transmission from '../services/transmission';
import { HostInstance } from '../models/hosts';
import { UserInstance } from '../models/users';
import { TorrentInstance } from '../models/torrents';

type UploadMethod = (
  ctx: Context,
  host: HostInstance,
  user: UserInstance,
) => Promise<TorrentInstance>;

const router = new Router();

const checkAuthenticated = authenticated();
const checkRoleUploader = authenticated({
  role: Roles.ROLE_UPLOADER,
  fetchUser: true,
});

const createUpload = (uploadMethod: UploadMethod) => async (ctx: Context) => {
  const { user } = ctx.state as { user: UserInstance };

  await Users.updateSpaceUsage(user);
  if (user.diskUsage > user.diskSpace) {
    throw new HttpError(409, 'Not enough space left');
  }

  const host = await Hosts.findAvailableHost();
  if (!host) {
    throw new HttpError(503, 'All servers are unavailable');
  }

  try {
    const torrent = await uploadMethod(ctx, host, user);
    await transmission.setRatio(torrent.hash, user.uploadRatio, {
      transmissionServiceUrl: host.transmissionServiceUrl!,
    });
    await Hosts.markNewUpload(host, torrent);
    return new Promise<void>(resolve =>
      // limit bash upload
      setTimeout(() => {
        ctx.body = torrent.dataValues;
        resolve();
      }, 1000),
    );
  } catch (e) {
    if (get(e, 'response.status') === 422) {
      throw new HttpError(422, get(e, 'response.data.data'));
    } else if (e instanceof DuplicatedTorrent) {
      throw new HttpError(409, e.message);
    }
    throw e;
  }
};

router.post(
  '/upload/file',
  checkRoleUploader,
  koaBody({ multipart: true }),
  joi(
    Joi.object({
      torrent: Joi.object().required(),
    }),
    'request.files',
  ),
  createUpload((ctx, host, user) =>
    transmission.uploadFile(
      ctx.request.files!.torrent.path,
      { id: host.id, transmissionServiceUrl: host.transmissionServiceUrl! },
      user.id,
    ),
  ),
);

router.post(
  '/upload/magnet',
  checkRoleUploader,
  joi(
    Joi.object({
      url: Joi.string().required(),
    }),
  ),
  createUpload((ctx, host, user) =>
    transmission.uploadMagnet(
      ctx.request.body.url,
      { id: host.id, transmissionServiceUrl: host.transmissionServiceUrl! },
      user.id,
    ),
  ),
);

router.get('/', checkAuthenticated, async ctx => {
  ctx.body = normalizeShort(
    (await Torrent.findAll({
      order: [['createdAt', 'DESC']],
      include: 'user',
    })).map(torrent => torrent.dataValues),
  );
});

export default router;
