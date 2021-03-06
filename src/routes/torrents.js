const Router = require('koa-router');
const koaBody = require('koa-body');
const Joi = require('@hapi/joi');
const get = require('lodash.get');

const { normalizeShort } = require('../services/normalizers/torrents');
const { Torrent } = require('../models');
const Hosts = require('../services/hosts');
const Users = require('../services/users');
const HttpError = require('../errors/httpError');
const DuplicatedTorrent = require('../errors/duplicatedTorrent');
const joi = require('../middlewares/joi');
const authenticated = require('../middlewares/authenticated');
const Roles = require('../services/roles');
const transmission = require('../services/transmission');

const router = new Router();

const checkAuthenticated = authenticated();
const checkRoleUploader = authenticated({
  role: Roles.ROLE_UPLOADER,
  fetchUser: true,
});

const createUpload = uploadMethod => async ctx => {
  const { user } = ctx.state;

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
    await transmission.setRatio(torrent.hash, user.uploadRatio, host);
    await Hosts.markNewUpload(host, torrent);
    return new Promise(resolve =>
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
    transmission.uploadFile(ctx.request.files.torrent.path, host, user.id),
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
    transmission.uploadMagnet(ctx.request.body.url, host, user.id),
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

module.exports = router;
