const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const errorsHandler = require('./middlewares/errorsHandler');
const sequelizeErrorsHandler = require('./middlewares/sequelizeErrorsHandler');

const hosts = (process.env.ALLOWED_ORIGINS || '').split(',');
const app = new Koa();

app
  .use(
    cors({
      origin: ctx => {
        if (hosts.includes(ctx.host)) {
          return '*';
        }
        return undefined;
      },
    }),
  )
  .use(bodyParser())
  .use(errorsHandler)
  .use(sequelizeErrorsHandler);

module.exports = app;
