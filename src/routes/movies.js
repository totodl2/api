const Router = require('koa-router');
const Joi = require('@hapi/joi');
const joi = require('../middlewares/joi');
const Movies = require('../services/movies');
const Genres = require('../services/genres');
const WatchStatus = require('../services/watchStatus');
const {
  normalize: normalizeWatchStatus,
} = require('../services/normalizers/watchStatus');
const getRessource = require('../middlewares/getRessource');
const authenticated = require('../middlewares/authenticated');
const { normalize, normalizeShort } = require('../services/normalizers/movies');

const router = new Router();
router.use(authenticated());

const getMovieMiddleware = getRessource(
  id =>
    Movies.get(id, [
      'genres',
      // { model: File, as: 'files', include: ['host', 'torrent'] },
    ]),
  'params.id',
);

router.get('/:id([0-9]+)', getMovieMiddleware, async ctx => {
  const {
    entity,
    jwt: { id: userId },
  } = ctx.state;
  const { genres = [], files: ignoredFiles, ...movie } = entity.dataValues;
  const files = await entity.getFiles({ include: ['host', 'torrent'] });
  const watchStatus = await WatchStatus.findForMovie(userId, movie.id);

  ctx.body = normalize({
    ...movie,
    genres: genres.map(genre => genre.dataValues),
    files: (files || []).map(file => file.dataValues),
    watchStatus: watchStatus ? watchStatus.dataValues : null,
  });
});

const renderMoviesPage = async (userId, genre, from, limit = 54) => {
  const genres = await Genres.getAllForMovies();
  const movies = await Movies.getLast({
    userId,
    genreId: genre ? genre.id : null,
    from,
    limit,
  });
  const seen = await WatchStatus.findForMovies(
    userId,
    movies.map(movie => movie.id),
  );

  return {
    genres,
    data: normalizeShort(movies),
    watchStatus: seen.map(ws => normalizeWatchStatus(ws.dataValues)),
  };
};

router.get(
  '/',
  joi(Joi.object({ from: Joi.number().min(0) }), 'request.query'),
  async ctx => {
    const { from = 0 } = ctx.query || {};
    const {
      jwt: { id: userId },
    } = ctx.state;
    ctx.body = await renderMoviesPage(userId, null, from);
  },
);

router.get(
  '/genres/:id([0-9]+)',
  joi(Joi.object({ from: Joi.number().min(0) }), 'request.query'),
  getRessource(id => Genres.get(id), 'params.id'),
  async ctx => {
    const {
      entity: genre,
      jwt: { id: userId },
    } = ctx.state;
    const { from = 0 } = ctx.query || {};
    ctx.body = await renderMoviesPage(userId, genre, from);
  },
);

module.exports = router;
