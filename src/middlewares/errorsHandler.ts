import { Context, Next } from 'koa';
import Sentry from '@sentry/node';
import debugFactory from '../debug';
import HttpError from '../errors/httpError';

const debug = debugFactory('error');

const errorHandlerMiddleware = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    const isDev = process.env.NODE_ENV !== 'production';
    const code = err.status || 500;

    if (code.toString().substr(0, 1) === '5') {
      Sentry.withScope(scope => {
        scope.addEventProcessor(event =>
          Sentry.Handlers.parseRequest(event, ctx.request),
        );
        Sentry.setExtra('ctxState', ctx.state);
        Sentry.captureException(err);
      });
    }

    debug(
      'Invalid request for %s, %s',
      ctx.request.path,
      err instanceof HttpError ? err.name : '',
    );

    ctx.status = code;
    ctx.body = {
      code,
      name:
        (isDev || err instanceof HttpError ? err.name : null) ||
        'Unknown error',
      message:
        (isDev || err instanceof HttpError ? err.message : null) ||
        'Unknown error',
      violations: err.violations, // seems to be { message: string, path: string[] }[]
    };
    ctx.app.emit('error', err, ctx);
  }
};

export default errorHandlerMiddleware;
