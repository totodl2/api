const Sentry = require('@sentry/node');
const debug = require('../debug')('error');
const HttpError = require('../errors/httpError');

module.exports = async (ctx, next) => {
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
      violations: err.violations,
    };
    ctx.app.emit('error', err, ctx);
  }
};
