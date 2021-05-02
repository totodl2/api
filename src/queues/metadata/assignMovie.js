const Files = require('../../services/files');
const Metadata = require('../../services/metadata');
const Movies = require('../../services/movies');
const Search = require('../../services/search');
const queue = require('./index');

module.exports = async (file, movieId) => {
  let movie = await Movies.get(movieId);

  if (!movie) {
    const metadata = await Metadata.getMovie(movieId);
    movie = await Movies.create(metadata);
  }

  const { movieId: oldMovieId } = file;
  await Files.setMovie(file, movie);

  await Search.addMovie(movie);
  await Search.addFile(file);

  if (oldMovieId) {
    await queue.add(queue.NAMES.VERIFY_MOVIE, { movieId: oldMovieId });
  }

  return `Movie "${movie.title}" assigned to "${file.basename}"`;
};
