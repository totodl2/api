const get = require('lodash.get');

module.exports = (schema, dataPath = 'request.body') => async (ctx, next) => {
  const result = schema
    .options({ abortEarly: false })
    .validate(get(ctx, dataPath));

  if (!result.error) {
    return next();
  }

  ctx.status = 422;
  ctx.body = result.error.details.map(({ message, path }) => ({
    message,
    path,
  }));

  return null;
};
