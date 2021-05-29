import Movies from '../../services/movies';
import Search from '../../services/search';
import { FileAttributes } from '../../models/files';

const verifyMovie = async (movieId: number) => {
  const movie = await Movies.get<{ files: FileAttributes[] }>(movieId, 'files');

  if (!movie) {
    return `Movie ${movieId} not found`;
  }
  if (movie.files.length > 0) {
    return `Movie ${movie.title} has ${movie.files.length} files attached`;
  }

  await movie.destroy();
  await Search.deleteMovie(movieId);

  return `Movie ${movie.title} removed`;
};

export default verifyMovie;
