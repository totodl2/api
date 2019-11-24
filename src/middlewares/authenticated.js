const Roles = require('../services/roles');
const HttpError = require('../errors/httpError');
const Jwt = require('../services/jwt');
const User = require('../services/users');

module.exports = ({ role, fetchUser } = {}) => async (ctx, next) => {
  const bearerToken =
    ctx.headers['x-authorization'] || ctx.query['x-authorization'];

  if (!bearerToken) {
    throw new HttpError(403);
  }

  const splitted = bearerToken.split(' ');
  if (splitted.length <= 1) {
    throw new HttpError(403);
  }

  try {
    ctx.state.jwt = Jwt.verify(splitted[1]);
  } catch (e) {
    throw new HttpError(403);
  }

  if (role && !Roles.hasRole(ctx.state.jwt.roles, role)) {
    throw new HttpError(403);
  }

  if (fetchUser) {
    ctx.state.user = await User.getById(ctx.state.jwt.id);
  }

  return next();
};
