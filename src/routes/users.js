const Router = require('koa-router');
const Joi = require('@hapi/joi');

const HttpError = require('../errors/httpError');
const userSchema = require('../validators/user');
const joi = require('../middlewares/joi');
const User = require('../services/users');
const { normalize: normalizeUser } = require('../services/normalizers/users');
const Jwt = require('../services/jwt');
const RefreshToken = require('../services/refreshToken');

const router = new Router();

const prepareLoggedUser = async (user, ip) => ({
  ...normalizeUser(user),
  token: await Jwt.create(user),
  refreshToken: (await RefreshToken.create(user.id, ip)).token,
});

router.put('/', joi(userSchema), async ctx => {
  const user = await User.create(ctx.request.body);
  ctx.body = await prepareLoggedUser(user.dataValues, ctx.request.ip);
});

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
      const { email, password } = ctx.request.body;
      const user = await User.authenticate(email, password);
      ctx.body = await prepareLoggedUser(user.dataValues, ctx.request.ip);
    } catch (e) {
      throw new HttpError(401, 'Invalid login or password');
    }
  },
);

module.exports = router;
