const Router = require('koa-router');
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
    Movies.get(id, ['genres', { model: File, as: 'files', include: 'host' }]),
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

router.get('/', async ctx => {
  const genres = await Genres.getAll();
  const selectedGenres = genres.slice(0, 5);
  const results = {
    genres,
    movies: [],
  };

  results.movies.push({
    type: 'last',
    data: normalizeShort(await Movies.getLast({ limit: 24 })),
  });

  for (let i = 0, sz = selectedGenres.length; i < sz; i++) {
    const genre = selectedGenres[i];
    results.movies.push({
      type: genre.id,
      data: normalizeShort(await Movies.getLast({ genreId: genre.id })),
    });
  }

  ctx.body = results;
});

const getGenreMiddleware = getRessource(id => Genres.get(id), 'params.id');

router.get('/genres/:id([0-9]+)', getGenreMiddleware, async ctx => {
  const { entity: genre } = ctx.state;
  const genres = await Genres.getAll();
  const results = {
    genres,
    movies: [],
  };

  results.movies.push({
    type: 'last',
    data: normalizeShort(
      await Movies.getLast({ genreId: genre.id, limit: 100 }),
    ),
  });

  ctx.body = results;
});

module.exports = router;
