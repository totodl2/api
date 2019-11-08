const HttpError = require('../errors/httpError');

module.exports = async (ctx, next) => {
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
      err.errors.map(({ message, path }) => ({
        message,
        path: [path],
      })),
    );
  }
};
