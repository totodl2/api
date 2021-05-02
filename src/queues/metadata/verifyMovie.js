const Movies = require('../../services/movies');
const Search = require('../../services/search');

module.exports = async movieId => {
  const movie = await Movies.get(movieId, 'files');
  if (movie.files.length > 0) {
    return `Movie ${movie.title} has ${movie.files.length} files attached`;
  }

  await movie.destroy();
  await Search.deleteMovie(movieId);

  return `Movie ${movie.title} removed`;
};
