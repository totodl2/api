import { Context, Next } from 'koa';
import get from 'lodash.get';
import HttpError from '../errors/httpError';

const getRessource = (
  getter: (param: any) => Promise<any>,
  path = 'req.params.id',
) => async (ctx: Context, next: Next) => {
  const entity = await getter(get(ctx, path));
  if (!entity) {
    throw new HttpError(404, 'Entity not found');
  }
  ctx.state.entity = entity;

  return next();
};

export default getRessource;
