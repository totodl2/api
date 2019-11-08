const get = require('lodash.get');
const HttpError = require('../errors/httpError');

module.exports = (schema, dataPath = 'request.body') => async (ctx, next) => {
  const result = schema
    .options({ abortEarly: false })
    .validate(get(ctx, dataPath));

  if (!result.error) {
    return next();
  }

  throw new HttpError(
    422,
    'Cannot validate submitted data',
    result.error.details.map(({ message, path }) => ({
      message,
      path,
    })),
  );
};
