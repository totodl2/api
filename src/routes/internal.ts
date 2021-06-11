/* eslint require-atomic-updates: 0 */

import Router from 'koa-router';
import Joi from '@hapi/joi';
import set from 'lodash.set';

import createApiKeyAuth from '../middlewares/createApiKeyAuth';
import joi from '../middlewares/joi';
import HttpError from '../errors/httpError';
import File from '../services/files';
import Transcoder from '../services/transcoder';

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
    const { id } = ctx.query as { id: string };
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
    const { status, progress, job } = ctx.request.body as {
      status: string;
      progress?: string | number;
      job: number;
    };
    const { id, name } = ctx.query as { id: string; name: string };
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

export default router;
