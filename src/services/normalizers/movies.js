const { normalizeBrief: normalizeFiles } = require('./files');
const { normalize: normalizeGenres } = require('./genres');

/**
 * @param {File} files
 * @param {Genre} genres
 * @param data
 * @return {*&{genres: *, files: *}}
 */
const normalizeOne = ({ files = [], genres = [], ...data }) => ({
  ...data,
  files: normalizeFiles(files),
  genres: normalizeGenres(genres),
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

module.exports = { normalize };
