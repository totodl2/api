import Files from '../../services/files';
import Metadata from '../../services/metadata';
import Movies from '../../services/movies';
import Search from '../../services/search';
import queue from './index';
import { FileInstance } from '../../models/files';
import convertDate from '../../utils/convertDate';
import { Types } from './types';

const assignMovie = async (file: FileInstance, movieId: number) => {
  let movie = await Movies.get(movieId);

  if (!movie) {
    const metadata = await Metadata.getMovie(movieId);
    movie = await Movies.create({
      ...metadata,
      id: parseInt(metadata.id, 10),
      releaseDate: convertDate(metadata.releaseDate),
    });
  }

  const { movieId: oldMovieId } = file;
  await Files.setMovie(file, movie);

  await Search.addMovie(movie);
  await Search.addFile(file);

  if (oldMovieId) {
    await queue.add(Types.VERIFY_MOVIE, { movieId: oldMovieId });
  }

  return `Movie "${movie.title}" assigned to "${file.basename}"`;
};

export default assignMovie;
