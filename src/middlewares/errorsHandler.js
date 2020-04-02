const Sentry = require('@sentry/node');
const HttpError = require('../errors/httpError');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const isDev = process.env.NODE_ENV !== 'production';
    const code = err.status || 500;

    if (code.toString().substr(0, 1) === '5') {
      Sentry.withScope(() => {
        Sentry.setExtra('body', ctx.request.body);
        Sentry.setExtra('ctxState', ctx.state);
        Sentry.captureException(err);
      });
    }

    ctx.status = code;
    ctx.body = {
      code,
      name:
        (isDev || err instanceof HttpError ? err.name : null) ||
        'Unknown error',
      message: err.message,
      violations: err.violations,
    };
    ctx.app.emit('error', err, ctx);
  }
};
