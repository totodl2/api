import Router from 'koa-router';
import Joi from '@hapi/joi';

import joi from '../middlewares/joi';
import Search, { ResultTypes } from '../services/search';
import Files from '../services/files';
import { createUrl } from '../services/normalizers/files';
import authenticated from '../middlewares/authenticated';
import { HostInstance } from '../models/hosts';

const router = new Router();

router.get(
  '/',
  authenticated(),
  joi(Joi.object({ keywords: Joi.string().required() }), 'request.query'),
  async ctx => {
    const { keywords } = ctx.request.query as { keywords: string };
    const results = await Search.search(keywords);
    const filesIds = results.hits
      .filter(r => r.type === ResultTypes.FILE)
      .map(r => r.id);
    const files =
      filesIds.length > 0
        ? await Files.findByIds<{ host: HostInstance }>(filesIds, ['host'])
        : [];

    ctx.body = {
      ...results,
      hits: results.hits.map(result => {
        if (result.type !== ResultTypes.FILE) {
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

module.exports = router; // @todo remove me
export default router;
