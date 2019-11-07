const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('./routes');
const errorsHandler = require('./middlewares/errorsHandler');

const app = new Koa();
app
  .use(bodyParser())
  .use(errorsHandler)
  .use(router.routes())
  .use(router.allowedMethods());

module.exports = app;
