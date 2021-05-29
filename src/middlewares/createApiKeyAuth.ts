import { Context, Next } from 'koa';
import HttpError from '../errors/httpError';

const createApiKeyAuth = (keys: string[]) => (ctx: Context, next: Next) => {
  if (keys.length <= 0) {
    return next();
  }

  const key = ctx.headers['x-api-key'] || ctx.query['api-key'] || '';

  if (!key || Array.isArray(key)) {
    throw new HttpError(401, 'API token missing');
  }

  if (!keys.includes(key.toLowerCase())) {
    throw new HttpError(403, 'Unauthorized token');
  }

  return next();
};

export default createApiKeyAuth;
