import get from 'lodash.get';
import { Context, Next } from 'koa';
import { Schema } from '@hapi/joi';
import HttpError from '../errors/httpError';

const joi = (schema: Schema, dataPath = 'request.body') => async (
  ctx: Context,
  next: Next,
) => {
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

export default joi;
