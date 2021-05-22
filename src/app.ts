import server from './server';
import router from './routes';
import sseRouter from './sse/all/router';

server
  .use(router.routes())
  .use(router.allowedMethods())
  .use(sseRouter.routes())
  .use(sseRouter.allowedMethods());

export default server;
