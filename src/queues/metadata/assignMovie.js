const Files = require('../../services/files');
const Metadata = require('../../services/metadata');
const Movies = require('../../services/movies');

module.exports = async (file, movieId) => {
  let movie = await Movies.get(movieId);

  if (!movie) {
    const metadata = await Metadata.getMovie(movieId);
    movie = await Movies.create(metadata);
  }

  await Files.setMovie(file, movie);
  return `Movie "${movie.title}" assigned to "${file.basename}"`;
};
