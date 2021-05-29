import { Job } from 'bull';
import createDebug from '../../debug';
import {
  AnalyzeFileMessage,
  AssignMovieMessage,
  AssignTvMessage,
  Types,
} from './types';
import Files from '../../services/files';
import analyzeFile from './analyzeFile';
import assignMovie from './assignMovie';
import verifyMovie from './verifyMovie';
import assignTv from './assignTv';
import verifyTv from './verifyTv';

const debug = createDebug('workers:metadataWorker');

const processor = async (job: Job) => {
  debug('Processing job %d - %s - %o', job.id, job.name, job.data);
  const { name } = job;

  // detect file type
  if (name === Types.FILE_ANALYZE) {
    return analyzeFile(job.data as AnalyzeFileMessage);
  }

  // check if movie has files associated to it
  if (name === Types.VERIFY_MOVIE) {
    return verifyMovie(job.data.movieId);
  }

  // assign movie to file
  if (name === Types.ASSIGN_MOVIE) {
    const { fileId, movieId } = job.data as AssignMovieMessage;
    const file = await Files.get(fileId);
    return assignMovie(file!, movieId);
  }

  // check if tv has files associated to it
  if (name === Types.VERIFY_TV) {
    return verifyTv(job.data.tvId);
  }

  if (name === Types.ASSIGN_TV) {
    const {
      fileId,
      tvId,
      episodeNumber,
      seasonNumber,
    } = job.data as AssignTvMessage;
    const file = await Files.get(fileId);
    return assignTv(file!, tvId, seasonNumber, episodeNumber);
  }

  return 'Unknown command';
};

export default processor;
