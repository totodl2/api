import HttpError from '../errors/httpError';
import { Context, Next } from 'koa';

const sequelizeErrorsHandler = async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    if (!err.name || !/^Sequelize.*Error$/i.test(err.name) || !err.errors) {
      throw err;
    }

    // sequelize validation handler
    throw new HttpError(
      422,
      'Cannot validate submitted data',
      err.errors.map(
        ({ message, path }: { message: string; path: string }) => ({
          message,
          path: [path],
        }),
      ),
    );
  }
};

export default sequelizeErrorsHandler;
