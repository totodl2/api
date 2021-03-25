const Router = require('koa-router');
const Joi = require('@hapi/joi');
const set = require('lodash.set');

const createApiKeyAuth = require('../middlewares/createApiKeyAuth');
const joi = require('../middlewares/joi');
const HttpError = require('../errors/httpError');
const File = require('../services/files');
const Transcoder = require('../services/transcoder');

const router = new Router();
const auth = createApiKeyAuth(
  (process.env.INTERNAL_API_KEYS || '')
    .split(',')
    .map(key => key.toLowerCase())
    .filter(Boolean),
);

router.use(auth);

router.post(
  '/muxer/notify',
  joi(
    Joi.object({
      id: Joi.alternatives()
        .try(Joi.number(), Joi.string())
        .required(),
    }).options({ allowUnknown: true }),
    'query',
  ),
  async ctx => {
    const { id } = ctx.query;
    const file = await File.get(id);
    if (!file) {
      throw new HttpError(404, `File ${id} not found`);
    }

    file.transcoded = ctx.request.body;
    file.transcodedAt = new Date();
    await file.save();

    ctx.body = true;
  },
);

router.post(
  '/transcoder/progress',
  joi(
    Joi.object({
      id: Joi.alternatives()
        .try(Joi.number(), Joi.string())
        .required(),
      name: Joi.string().required(),
    }).options({ allowUnknown: true }),
    'query',
  ),
  joi(
    Joi.object({
      status: Joi.string().required(),
      progress: Joi.alternatives().try(Joi.number(), Joi.string()),
      job: Joi.number().required(),
    }),
  ),
  async ctx => {
    const { status, progress, job } = ctx.request.body;
    const { id, name } = ctx.query;
    const file = await File.get(id);

    if (!file) {
      throw new HttpError(404, `File ${id} not found`);
    }

    if (status === 'progress') {
      const transcodingStatus = file.transcodingStatus || {};
      set(transcodingStatus, [name, 'progress'], progress);
      set(transcodingStatus, [name, 'job'], job);
      await file.update({ transcodingStatus });
    }

    if (status === 'failed') {
      await file.update({ transcodingFailedAt: new Date() });
      await Transcoder.clean(id);
    }

    ctx.body = true;
  },
);
module.exports = router;
