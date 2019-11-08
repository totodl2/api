module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (!err.name || !/^Sequelize.*Error$/i.test(err.name) || !err.errors) {
      throw err;
    }

    // sequelize validation handler
    ctx.status = 422;
    ctx.body = err.errors.map(({ message, path }) => ({
      message,
      path: [path],
    }));
  }
};
