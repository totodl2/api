const Router = require('koa-router');

const Files = require('../services/files');
const authenticated = require('../middlewares/authenticated');
const Transcoder = require('../services/transcoder');
const getRessource = require('../middlewares/getRessource');
const { ROLE_ADMIN } = require('../services/roles');

const router = new Router();

router.post(
  '/queue/:file([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  authenticated({ role: ROLE_ADMIN }),
  getRessource(id => Files.get(id), 'params.file'),
  async ctx => {
    ctx.body = await Transcoder.transcode(ctx.state.entity);
  },
);

module.exports = router;
