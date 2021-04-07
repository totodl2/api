const Metadata = require('../../services/metadata');

const { TYPES } = Metadata.Metadata;

module.exports = async ({ data: file }) => {
  const mediaInfos = await Metadata.inspect(file.basename);

  if (mediaInfos.type === TYPES.EPISODE) {
    const tvResults = await Metadata.searchTv(mediaInfos.title);

    if (tvResults.length <= 0) {
      return `No tv show found for ${mediaInfos.title}`;
    }

    const tvId = tvResults[0].id;
    const job = await Metadata.assignTv(
      file,
      tvId,
      mediaInfos.season,
      mediaInfos.episode,
    );

    return `Assign tv ${tvId} in job ${job.id}`;
  }

  if (mediaInfos.type === TYPES.MOVIE) {
    const moviesResults = await Metadata.searchMovie(mediaInfos.title);

    if (moviesResults.length <= 0) {
      return `No movies found for ${mediaInfos.title}`;
    }

    const movieId = moviesResults[0].id;
    const job = await Metadata.assignMovie(file, movieId);

    return `Assign movie ${movieId} in job ${job.id}`;
  }

  return `Invalid media type ${mediaInfos.type}`;
};
