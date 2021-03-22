const Router = require('koa-router');
const createApiKeyAuth = require('../middlewares/createApiKeyAuth');

const users = require('./users');
const tokens = require('./tokens');
const torrents = require('./torrents');
const torrent = require('./torrent');
const internal = require('./internal');
const metadata = require('./metadata');
const movies = require('./movies');

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
// Internal routes
router.use(
  '/internal',
  createApiKeyAuth(
    (process.env.INTERNAL_API_KEYS || '')
      .split(',')
      .map(key => key.toLowerCase())
      .filter(Boolean),
  ),
  internal.routes(),
);

module.exports = router;
