const Router = require('koa-router');
const users = require('./users');

const router = new Router();

// User routes
router.use('/users', users.routes());

module.exports = router;
