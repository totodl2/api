const get = require('lodash.get');

const HttpError = require('../errors/httpError');

module.exports = (getter, path = 'req.params.id') => async (ctx, next) => {
  const entity = await getter(get(ctx, path));
  if (!entity) {
    throw new HttpError(404, 'Entity not found');
  }
  ctx.state.entity = entity;

  return next();
};
