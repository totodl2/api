import { Context, Next } from 'koa';
import { hasRole } from '../services/roles';
import HttpError from '../errors/httpError';
import Jwt from '../services/jwt';
import User from '../services/users';

const createAuthenticatedMiddleware = ({
  role,
  fetchUser,
}: { role?: number; fetchUser?: boolean } = {}) => async (
  ctx: Context,
  next: Next,
) => {
  const bearerToken =
    ctx.headers['x-authorization'] || ctx.query['x-authorization'];

  if (!bearerToken || Array.isArray(bearerToken)) {
    throw new HttpError(403, 'Invalid token');
  }

  const splitted = (bearerToken as string).split(' ');
  if (splitted.length <= 1) {
    throw new HttpError(403, 'Invalid token');
  }

  try {
    ctx.state.jwt = Jwt.verify(splitted[1]);
  } catch (e) {
    throw new HttpError(403, 'Invalid token');
  }

  if (role && !hasRole(ctx.state.jwt.roles, role)) {
    throw new HttpError(403, 'Invalid grant');
  }

  if (fetchUser) {
    ctx.state.user = await User.getById(ctx.state.jwt.id);
  }

  return next();
};

export default createAuthenticatedMiddleware;
