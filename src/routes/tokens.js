const Router = require('koa-router');
const Joi = require('@hapi/joi');

const HttpError = require('../errors/httpError');
const joi = require('../middlewares/joi');
const RefreshToken = require('../services/refreshToken');

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
      throw new HttpError('Cannot renew this token', 401);
    }
  },
);

module.exports = router;
