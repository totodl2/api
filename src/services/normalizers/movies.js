const { normalize: normalizeFiles } = require('./files');
const { normalize: normalizeGenres } = require('./genres');
const { normalize: normalizeWatchStatus } = require('./watchStatus');

/**
 * @param {File[]} files
 * @param {Genre[]} genres
 * @param {WatchStatus} watchStatus
 * @param data
 * @return {*&{genres: *, files: *}}
 */
const normalizeOne = ({ files = [], genres = [], watchStatus, ...data }) => ({
  ...data,
  files: normalizeFiles(files),
  genres: normalizeGenres(genres),
  watchStatus: watchStatus ? normalizeWatchStatus(watchStatus) : null,
});

/**
 * @param {Array<Movie>|Movie} movies
 * @return {Object}
 */
const normalize = movies => {
  if (Array.isArray(movies)) {
    return movies.map(movie => normalizeOne(movie));
  }
  return normalizeOne(movies);
};

const normalizeOneShort = ({
  id,
  backdropPath,
  originalTitle,
  popularity,
  posterPath,
  title,
  releaseDate,
}) => ({
  id,
  backdropPath,
  originalTitle,
  popularity,
  posterPath,
  title,
  releaseDate,
});

const normalizeShort = movies => {
  if (Array.isArray(movies)) {
    return movies.map(movie => normalizeOneShort(movie));
  }
  return normalizeOneShort(movies);
};

module.exports = { normalize, normalizeShort };
