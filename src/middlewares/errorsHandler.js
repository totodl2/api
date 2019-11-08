const HttpError = require('../errors/httpError');

/** @todo Sentry */
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const isDev = process.env.NODE_ENV !== 'production';
    ctx.status = err.status || 500;
    ctx.body = {
      message:
        isDev || err instanceof HttpError ? err.message : 'Unknown error',
    };
    ctx.app.emit('error', err, ctx);
  }
};
