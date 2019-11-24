const Router = require('koa-router');
const authenticated = require('../../middlewares/authenticated');
const { middleware } = require('./sse');

const router = new Router();
router.get('/sse/torrents', authenticated(), middleware);

module.exports = router;
