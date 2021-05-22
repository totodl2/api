import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';

import errorsHandler from './middlewares/errorsHandler';
import sequelizeErrorsHandler from './middlewares/sequelizeErrorsHandler';

const hosts = (process.env.ALLOWED_ORIGINS || '').split(',');
const app = new Koa();

app
  .use(
    cors({
      origin: (ctx: Koa.Context) => {
        if (hosts.includes(ctx.origin)) {
          return '*';
        }
        return '';
      },
    }),
  )
  .use(bodyParser())
  .use(errorsHandler)
  .use(sequelizeErrorsHandler);

app.proxy = !!process.env.PROXIED && !!parseInt(process.env.PROXIED, 10);

export default app;
