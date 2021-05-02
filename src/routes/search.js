const Router = require('koa-router');
const Joi = require('@hapi/joi');

const joi = require('../middlewares/joi');
const Search = require('../services/search');
const Files = require('../services/files');
const { createUrl } = require('../services/normalizers/files');
const authenticated = require('../middlewares/authenticated');

const router = new Router();

router.get(
  '/',
  authenticated(),
  joi(Joi.object({ keywords: Joi.string().required() }), 'request.query'),
  async ctx => {
    const { keywords } = ctx.request.query;
    const results = await Search.search(keywords);
    const filesIds = results.hits
      .filter(r => r.type === Search.TYPES.FILE)
      .map(r => r.id);
    const files =
      filesIds.length > 0 ? await Files.findByIds(filesIds, ['host']) : [];

    ctx.body = {
      ...results,
      hits: results.hits.map(result => {
        if (result.type !== Search.TYPES.FILE) {
          return result;
        }

        const file = files.find(cf => cf.id === result.id);
        if (!file || !file.isComplete()) {
          return result;
        }

        return {
          ...result,
          url: createUrl(file.dataValues, file.host.dataValues),
        };
      }),
    };
  },
);

module.exports = router;
