const Metadata = require('../../services/metadata');
const queue = require('./index');

const { TYPES } = Metadata.Metadata;

module.exports = async ({ data: file }) => {
  const mediaInfos = await Metadata.inspect(file.basename);

  if (mediaInfos.type === TYPES.EPISODE) {
    return 'Episode';
  }

  if (mediaInfos.type === TYPES.MOVIE) {
    const moviesResult = await Metadata.searchMovie(mediaInfos.title);

    if (moviesResult.length <= 0) {
      return `No movies found for ${mediaInfos.title}`;
    }

    const movieId = moviesResult[0].id;
    const job = await queue.add(queue.NAMES.ASSIGN_MOVIE, {
      file,
      movieId,
    });

    return `Assign movie ${movieId} in job ${job.id}`;
  }

  return `Invalid media type ${mediaInfos.type}`;
};
