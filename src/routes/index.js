const Router = require('koa-router');

const users = require('./users');
const tokens = require('./tokens');
const torrents = require('./torrents');
const torrent = require('./torrent');
const internal = require('./internal');
const metadata = require('./metadata');
const movies = require('./movies');
const tv = require('./tv');
const transcoders = require('./transcoders');
const watchStatus = require('./watchStatus');

const router = new Router();

// User routes
router.use('/users', users.routes());
// Tokens routes
router.use('/tokens', tokens.routes());
// Torrents routes
router.use('/torrents', torrents.routes());
// Torrent routes
router.use('/torrents/:hash([a-zA-Z0-9]{40})', torrent.routes());
// metadata routes
router.use('/metadata', metadata.routes());
// movies routes
router.use('/movies', movies.routes());
// tv routes
router.use('/tv', tv.routes());
// Internal routes
router.use('/internal', internal.routes());
// transcoder routes
router.use('/transcoders', transcoders.routes());
// watch status routes
router.use('/watch-status', watchStatus.routes());

module.exports = router;
