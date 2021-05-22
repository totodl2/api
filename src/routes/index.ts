import Router from 'koa-router';

import users from './users';
import tokens from './tokens';
import torrents from './torrents';
import torrent from './torrent';
import internal from './internal';
import metadata from './metadata';
import movies from './movies';
import search from './search';
import tv from './tv';
import transcoders from './transcoders';
import watchStatus from './watchStatus';

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
// search routes
router.use('/search', search.routes());

module.exports = router; // @todo : remove me
export default router;
