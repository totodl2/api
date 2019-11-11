const HttpError = require('../errors/httpError');

/** @todo Sentry */
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const isDev = process.env.NODE_ENV !== 'production';
    const code = err.status || 500;
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
