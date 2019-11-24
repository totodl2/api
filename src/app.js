const server = require('./server');
const router = require('./routes');
const sseTorrentsRouter = require('./sse/torrents/router');

server
  .use(router.routes())
  .use(router.allowedMethods())
  .use(sseTorrentsRouter.routes())
  .use(sseTorrentsRouter.allowedMethods());

module.exports = server;
