const Router = require('koa-router');
const userSchema = require('../validators/user');
const joi = require('../middlewares/joi');
const UserService = require('../services/user');

const router = new Router();

router.post('/', joi(userSchema), async ctx => {
  const user = await UserService.create(ctx.request.body);
  ctx.body = user.toObject();
});

module.exports = router;
