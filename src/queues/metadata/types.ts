import { FileMessage } from '../../types/FileMessage';

export enum Types {
  FILE_ANALYZE = 'file.analyze', // it will analyze the given file
  ASSIGN_MOVIE = 'movie.assign', // assign movie to file
  VERIFY_MOVIE = 'movie.verify', // it will check if there is files associated with the given movie
  VERIFY_TV = 'tv.verify', // it will check if there is files associated with the given tv show
  ASSIGN_TV = 'tv.assign', // assign tv show to file
}

export type AnalyzeFileMessage = { data: FileMessage };

export type AssignTvMessage = {
  fileId: string;
  tvId: number;
  seasonNumber: number;
  episodeNumber: number;
};

export type AssignMovieMessage = {
  fileId: string;
  movieId: number;
};
