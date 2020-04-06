const Router = require('koa-router');
const Joi = require('@hapi/joi');

const joi = require('../middlewares/joi');
const HttpError = require('../errors/httpError');
const File = require('../services/files');

const router = new Router();

router.post(
  '/muxer/notify',
  joi(
    Joi.object({
      id: Joi.alternatives()
        .try(Joi.number(), Joi.string())
        .required(),
    }).options({ allowUnknown: true }),
    'query',
  ),
  async ctx => {
    const { id } = ctx.query;
    const file = await File.get(id);
    if (!file) {
      throw new HttpError(404, `File ${id} not found`);
    }

    file.transcoded = ctx.request.body;
    file.transcodedAt = new Date();
    await file.save();

    ctx.body = true;
  },
);

module.exports = router;
