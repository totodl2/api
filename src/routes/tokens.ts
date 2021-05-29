import Router from 'koa-router';
import Joi from '@hapi/joi';

import HttpError from '../errors/httpError';
import joi from '../middlewares/joi';
import RefreshToken from '../services/refreshToken';

const router = new Router();

router.post(
  '/renew',
  joi(
    Joi.object({
      token: Joi.string().required(),
      refreshToken: Joi.string()
        .alphanum()
        .length(64)
        .required(),
    }),
  ),
  async ctx => {
    const { token, refreshToken } = ctx.request.body;
    try {
      const newToken = await RefreshToken.consume(
        refreshToken,
        token,
        ctx.request.ip,
      );
      ctx.body = { token: newToken };
    } catch (e) {
      throw new HttpError(401, 'Cannot renew this token');
    }
  },
);

export default router;
