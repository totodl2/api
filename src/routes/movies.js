const Router = require('koa-router');
const Joi = require('@hapi/joi');
const joi = require('../middlewares/joi');
const Movies = require('../services/movies');
const Genres = require('../services/genres');
const { File } = require('../models');
const getRessource = require('../middlewares/getRessource');
const authenticated = require('../middlewares/authenticated');
const { normalize, normalizeShort } = require('../services/normalizers/movies');

const router = new Router();
router.use(authenticated());

const getMovieMiddleware = getRessource(
  id =>
    Movies.get(id, [
      'genres',
      { model: File, as: 'files', include: ['host', 'torrent'] },
    ]),
  'params.id',
);

router.get('/:id([0-9]+)', getMovieMiddleware, async ctx => {
  const { entity } = ctx.state;
  const { genres = [], files = [], ...movie } = entity.dataValues;
  ctx.body = normalize({
    ...movie,
    genres: genres.map(genre => genre.dataValues),
    files: files.map(file => file.dataValues),
  });
});

const renderMoviesPage = async (genre, from, limit = 102) => {
  const genres = await Genres.getAllForMovies();
  return {
    genres,
    data: normalizeShort(
      await Movies.getLast({ genreId: genre ? genre.id : null, from, limit }),
    ),
  };
};

router.get(
  '/',
  joi(Joi.object({ from: Joi.number().min(0) }), 'request.query'),
  async ctx => {
    const { from = 0 } = ctx.query || {};
    ctx.body = await renderMoviesPage(null, from);
  },
);

router.get(
  '/genres/:id([0-9]+)',
  joi(Joi.object({ from: Joi.number().min(0) }), 'request.query'),
  getRessource(id => Genres.get(id), 'params.id'),
  async ctx => {
    const { entity: genre } = ctx.state;
    const { from = 0 } = ctx.query || {};
    ctx.body = await renderMoviesPage(genre, from);
  },
);

module.exports = router;
