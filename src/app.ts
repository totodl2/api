import server from './server';
import router from './routes';
import sseRouter from './sse/all/router';

const app = server
  .use(router.routes())
  .use(router.allowedMethods())
  .use(sseRouter.routes())
  .use(sseRouter.allowedMethods());

export default app;
