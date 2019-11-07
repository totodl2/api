/** @todo Sentry */
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      message:
        process.env.NODE_ENV !== 'production' ? err.message : 'Unknown error',
    };
    ctx.app.emit('error', err, ctx);
  }
};
