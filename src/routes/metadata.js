const Router = require('koa-router');
const Metadata = require('../services/metadata');
const authenticated = require('../middlewares/authenticated');

const router = new Router();
router.use(authenticated());

router.get('/', async ctx => {
  if (Metadata.enabled) {
    ctx.body = {
      enabled: true,
      ...(await Metadata.getConfiguration()),
    };
  } else {
    ctx.body = { enabled: false };
  }
});

module.exports = router;
