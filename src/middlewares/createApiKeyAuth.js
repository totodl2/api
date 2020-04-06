const HttpError = require('../errors/httpError');

module.exports = keys => (ctx, next) => {
  if (keys.length <= 0) {
    return next();
  }

  const key = (
    ctx.headers['x-api-key'] ||
    ctx.query['api-key'] ||
    ''
  ).toLowerCase();

  if (!key) {
    throw new HttpError(401, 'API token missing');
  }

  if (!keys.includes(key)) {
    throw new HttpError(403, 'Unauthorized token');
  }

  return next();
};
