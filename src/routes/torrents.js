const Router = require('koa-router');
const koaBody = require('koa-body');
const Joi = require('@hapi/joi');

const Hosts = require('../services/hosts');
const HttpError = require('../errors/httpError');
const joi = require('../middlewares/joi');
const authenticated = require('../middlewares/authenticated');
const Roles = require('../services/roles');
const transmission = require('../services/transmission');

const router = new Router();
router.use(authenticated({ role: Roles.ROLE_UPLOADER }));

router.post(
  '/upload/file',
  koaBody({ multipart: true }),
  joi(
    Joi.object({
      torrent: Joi.object().required(),
    }),
    'request.files',
  ),
  async ctx => {
    try {
      const host = await Hosts.findAvailableHost();
      if (!host) {
        throw new HttpError(503, 'All servers are unavailable');
      }

      const r = await transmission.uploadFile(
        ctx.request.files.torrent.path,
        host,
      );

      ctx.body = 'ok';
    } catch (e) {
      console.log('la eror => ', e);
      // throw e;
      ctx.body = 'NTM';
      ctx.status = 200;
    }
  },
);

router.post(
  '/upload/magnet',
  joi(
    Joi.object({
      url: Joi.string().required(),
    }),
  ),
  async ctx => {
    try {
      const host = await Hosts.findAvailableHost();
      if (!host) {
        throw new HttpError(503, 'All servers are unavailable');
      }

      const r = await transmission.uploadMagnet(ctx.request.body.url, host);

      ctx.body = 'ok';
    } catch (e) {
      console.log('la eror => ', e);
      // throw e;
      ctx.body = 'NTM';
      ctx.status = 200;
    }
  },
);

module.exports = router;
