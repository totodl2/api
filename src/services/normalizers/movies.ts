import { normalize as normalizeFiles } from './files';
import { normalize as normalizeGenres } from './genres';
import { normalize as normalizeWatchStatus } from './watchStatus';
import { MovieAttributes } from '../../models/movies';
import { FileAttributes } from '../../models/files';
import { GenreAttributes } from '../../models/genres';
import { WatchStatusAttributes } from '../../models/watch-status';

type CompleteMovieType = MovieAttributes & {
  files?: FileAttributes[];
  genres?: GenreAttributes[];
  watchStatus?: WatchStatusAttributes | null;
};

const normalizeOne = ({
  files = [],
  genres = [],
  watchStatus,
  ...data
}: CompleteMovieType) => ({
  ...data,
  files: normalizeFiles(files),
  genres: normalizeGenres(genres),
  watchStatus: watchStatus ? normalizeWatchStatus(watchStatus) : null,
});

export const normalize = (movies: CompleteMovieType | CompleteMovieType[]) => {
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
}: MovieAttributes) => ({
  id,
  backdropPath,
  originalTitle,
  popularity,
  posterPath,
  title,
  releaseDate,
});

export const normalizeShort = (movies: MovieAttributes | MovieAttributes[]) => {
  if (Array.isArray(movies)) {
    return movies.map(movie => normalizeOneShort(movie));
  }
  return normalizeOneShort(movies);
};

module.exports = { normalize, normalizeShort }; // @todo remove me
export default { normalize, normalizeShort };
