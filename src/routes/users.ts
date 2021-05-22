import Router from 'koa-router';
import Joi from '@hapi/joi';

import HttpError from '../errors/httpError';
import joi from '../middlewares/joi';
import authenticated from '../middlewares/authenticated';

import User from '../services/users';
import { normalizeFull as normalizeUser } from '../services/normalizers/users';
import Jwt from '../services/jwt';
import RefreshToken from '../services/refreshToken';
import { UserAttributes, UserInstance } from '../models/users';

const router = new Router();

const prepareLoggedUser = async (user: UserAttributes, ip: string) => ({
  ...normalizeUser(user),
  token: await Jwt.create(user),
  refreshToken: (await RefreshToken.create(user.id, ip)).token,
});

router.put(
  '/',
  joi(
    Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
      nickname: Joi.string()
        .alphanum()
        .required(),
    }),
  ),
  async ctx => {
    const { email, password, nickname } = ctx.request.body as {
      email: string;
      password: string;
      nickname: string;
    };
    const user = await User.create({ email, password, nickname });
    ctx.body = await prepareLoggedUser(user.dataValues, ctx.request.ip);
  },
);

router.post(
  '/login',
  joi(
    Joi.object({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .required(),
    }),
  ),
  async ctx => {
    try {
      const { email, password } = ctx.request.body as {
        email: string;
        password: string;
      };
      const user = await User.authenticate(email, password);
      ctx.body = await prepareLoggedUser(user.dataValues, ctx.request.ip);
    } catch (e) {
      throw new HttpError(401, 'Invalid login or password');
    }
  },
);

router.get('/me', authenticated({ fetchUser: true }), ctx => {
  const { user } = ctx.state as { user: UserInstance };
  ctx.body = normalizeUser(user.dataValues);
});

module.exports = router; // @todo remove me
export default router;
