const Router = require('koa-router');

const Files = require('../services/files');
const WatchStatus = require('../services/watchStatus');
const { normalize } = require('../services/normalizers/watchStatus');
const authenticated = require('../middlewares/authenticated');
const getRessource = require('../middlewares/getRessource');

const router = new Router();
router.use(authenticated());

const getFileMiddleware = getRessource(
  id => Files.get(id, 'torrent'),
  'params.file',
);

router.get(
  '/files/:file([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
  getFileMiddleware,
  async ctx => {
    const {
      entity: file,
      jwt: { id: userId },
    } = ctx.state;
    const status = await WatchStatus.find(userId, file);
    ctx.body = status ? normalize(status.dataValues) : null;
  },
);

router.post(
  '/files/:file([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})/:position([0-9]+)/:length([0-9]+)',
  getFileMiddleware,
  async ctx => {
    const {
      entity: file,
      jwt: { id: userId },
    } = ctx.state;
    const { position, length } = ctx.params;
    const status = await WatchStatus.upsert(userId, file, {
      position: parseInt(position, 10),
      length: parseInt(length, 10),
    });
    ctx.body = status ? normalize(status.dataValues) : null;
  },
);

module.exports = router;
