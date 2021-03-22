const Router = require('koa-router');
const Movies = require('../services/movies');
const getRessource = require('../middlewares/getRessource');
const authenticated = require('../middlewares/authenticated');
const { normalize } = require('../services/normalizers/movies');

const router = new Router();
router.use(authenticated());

const getMovieMiddleware = getRessource(
  id => Movies.get(id, ['genres', 'files']),
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

module.exports = router;
