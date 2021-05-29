import Router from 'koa-router';
import authenticated from '../../middlewares/authenticated';
import { createRoute } from './sse';

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

export default router;
