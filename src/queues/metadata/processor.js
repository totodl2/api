const debug = require('debug')('api:workers:metadataWorker');
const queue = require('./index');
const Files = require('../../services/files');
const analyzeFile = require('./analyzeFile');
const assignMovie = require('./assignMovie');
const verifyMovie = require('./verifyMovie');
const assignTv = require('./assignTv');
const verifyTv = require('./verifyTv');

module.exports = async job => {
  debug('Processing job %d - %s - %o', job.id, job.name, job.data);
  const { name } = job;

  // detect file type
  if (name === queue.NAMES.FILE_ANALYZE) {
    return analyzeFile(job.data);
  }

  // check if movie has files associated to it
  if (name === queue.NAMES.VERIFY_MOVIE) {
    return verifyMovie(job.data.movieId);
  }

  // assign movie to file
  if (name === queue.NAMES.ASSIGN_MOVIE) {
    const {
      file: { id },
      movieId,
    } = job.data;
    const file = await Files.get(id);
    return assignMovie(file, movieId);
  }

  // check if tv has files associated to it
  if (name === queue.NAMES.VERIFY_TV) {
    return verifyTv(job.data.tvId);
  }

  if (name === queue.NAMES.ASSIGN_TV) {
    const {
      file: { id },
      tvId,
      episodeNumber,
      seasonNumber,
    } = job.data;
    const file = await Files.get(id);
    return assignTv(file, tvId, seasonNumber, episodeNumber);
  }

  return 'Unknown command';
};
