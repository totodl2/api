const Router = require('koa-router');
const users = require('./users');
const tokens = require('./tokens');
const torrents = require('./torrents');
const torrent = require('./torrent');

const router = new Router();

// User routes
router.use('/users', users.routes());
// Tokens routes
router.use('/tokens', tokens.routes());
// Torrents routes
router.use('/torrents', torrents.routes());
// Torrent routes
router.use('/torrents/:hash([a-zA-Z0-9]{40})', torrent.routes());

module.exports = router;
