const Router = require('koa-router');
const users = require('./users');
const tokens = require('./tokens');

const router = new Router();

// User routes
router.use('/users', users.routes());
// Tokens routes
router.use('/tokens', tokens.routes());

module.exports = router;
