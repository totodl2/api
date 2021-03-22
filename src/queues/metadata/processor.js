const debug = require('debug')('api:workers:metadataWorker');
const queue = require('./index');
const Files = require('../../services/files');
const Metadata = require('../../services/metadata');
const Movies = require('../../services/movies');

const { TYPES } = Metadata.Metadata;

const analyzeMovie = async (file, mediaInfos) => {
  const moviesResult = await Metadata.searchMovie(mediaInfos.title);
  if (moviesResult.length <= 0) {
    return `No movies found for ${mediaInfos.title}`;
  }

  const movieId = moviesResult[0].id;
  let movie = await Movies.get(movieId);

  if (!movie) {
    const metadata = await Metadata.getMovie(movieId);
    movie = await Movies.create(metadata);
  }

  await Files.setMovie(file, movie);
  return `Movie ${movie.title} assigned to ${mediaInfos.title}`;
};

const verifyMovie = async movieId => {
  const movie = await Movies.get(movieId, 'files');
  if (movie.files.length > 0) {
    return `Movie ${movie.title} has ${movie.files.length} files attached`;
  }

  await movie.destroy();
  return `Movie ${movie.title} removed`;
};

module.exports = async job => {
  debug('Processing job %d - %s - %s', job.id, job.name, job.data.objectId);
  const { name } = job;

  if (name === queue.NAMES.ANALYZE) {
    const { objectId } = job.data;
    const file = await Files.get(objectId);
    const mediaInfos = await Metadata.inspect(file.basename);

    if (mediaInfos.type === TYPES.EPISODE) {
      return 'Episode';
    }
    return analyzeMovie(file, mediaInfos);
  }

  if (name === queue.NAMES.VERIFY) {
    const { movieId } = job.data;
    return verifyMovie(movieId);
  }

  return 'Unknown command';
};
