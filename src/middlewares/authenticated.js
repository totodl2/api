const Roles = require('../services/roles');
const HttpError = require('../errors/httpError');
const Jwt = require('../services/jwt');
const User = require('../services/user');

module.exports = ({ role, fetchUser = true } = {}) => async (ctx, next) => {
  const bearerToken = ctx.headers['x-authorization'];
  if (!bearerToken) {
    throw new HttpError(403);
  }

  const splitted = bearerToken.split(' ');
  if (splitted.length <= 1) {
    throw new HttpError(403);
  }

  try {
    const jwt = Jwt.verify(splitted[1]);
    ctx.state.jwt = jwt;
  } catch (e) {
    throw new HttpError(403);
  }

  if (role && !Roles.hasRole(ctx.state.jwt.roles, role)) {
    throw new HttpError(403);
  }

  if (fetchUser) {
    ctx.state.user = await User.getById(ctx.state.jwt.id);
  }

  next();
};
