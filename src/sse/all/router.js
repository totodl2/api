const Router = require('koa-router');
const authenticated = require('../../middlewares/authenticated');
const { createRoute } = require('./sse');

const router = new Router();
router.get(
  '/sse',
  authenticated(),
  createRoute(ctx => {
    ctx.subscribe('torrents.*');
    ctx.subscribe('files.*');
    ctx.subscribe(`users.${ctx.state.jwt.id}.*`);
  }),
);

module.exports = router;
