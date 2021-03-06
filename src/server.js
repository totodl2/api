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
        if (hosts.includes(ctx.origin)) {
          return '*';
        }
        return undefined;
      },
    }),
  )
  .use(bodyParser())
  .use(errorsHandler)
  .use(sequelizeErrorsHandler);

app.proxy = process.env.PROXIED && !!parseInt(process.env.PROXIED, 10);

module.exports = app;
