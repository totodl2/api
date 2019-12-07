const server = require('./server');
const router = require('./routes');
const sseRouter = require('./sse/all/router');

server
  .use(router.routes())
  .use(router.allowedMethods())
  .use(sseRouter.routes())
  .use(sseRouter.allowedMethods());

module.exports = server;
