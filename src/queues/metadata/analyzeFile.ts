import { AnalyzeFileMessage } from './types';

import Metadata, { MetadataTypes } from '../../services/metadata';

// const { TYPES } = Metadata.Metadata;

const analyzeFile = async ({ data: file }: AnalyzeFileMessage) => {
  const mediaInfos = await Metadata.inspect(file.basename!);

  if (mediaInfos.type === MetadataTypes.EPISODE) {
    const tvResults = await Metadata.searchTv(mediaInfos.title);

    if (tvResults.length <= 0) {
      return `No tv show found for ${mediaInfos.title}`;
    }

    if (!mediaInfos.season) {
      return `No season number found for ${mediaInfos.title}`;
    }

    if (mediaInfos.episode === undefined || Array.isArray(mediaInfos.episode)) {
      return `No episode number found for ${mediaInfos.title}`;
    }

    const tvId = parseInt(tvResults[0].id, 10);
    const job = await Metadata.assignTv(
      file.id,
      tvId,
      mediaInfos.season,
      mediaInfos.episode,
    );

    return `Assign tv ${tvId} in job ${job.id}`;
  }

  if (mediaInfos.type === MetadataTypes.MOVIE) {
    const moviesResults = await Metadata.searchMovie(mediaInfos.title);

    if (moviesResults.length <= 0) {
      return `No movies found for ${mediaInfos.title}`;
    }

    const movieId = parseInt(moviesResults[0].id, 10);
    const job = await Metadata.assignMovie(file.id, movieId);

    // @ts-ignore
    return `Assign movie ${movieId} in job ${job.id}`;
  }

  return `Invalid media type ${mediaInfos.type}`;
};

export default analyzeFile;
