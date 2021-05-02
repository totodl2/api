const Files = require('../../services/files');
const Metadata = require('../../services/metadata');
const Tv = require('../../services/tv');
const Search = require('../../services/search');
const queue = require('./index');

const REFRESH_DELAY = 24 * 60 * 60 * 1000; // 1 days

module.exports = async (file, tvId, seasonNumber, episodeNumber) => {
  let tv = await Tv.get(tvId);

  if (!tv) {
    const metadata = await Metadata.getTv(tvId);
    tv = await Tv.create(metadata);
  }

  if (
    !Tv.hasEpisode(tv, seasonNumber, episodeNumber) &&
    tv.updatedAt.getTime() + REFRESH_DELAY < Date.now()
  ) {
    const newMetadata = await Metadata.getTv(tvId);
    tv = await Tv.update(tv, newMetadata);
  }

  const { tvId: oldTvId } = file;
  await Files.setTv(file, tv, seasonNumber, episodeNumber);

  await Search.addTvShow(tv);
  await Search.addFile(file);

  if (oldTvId) {
    await queue.add(queue.NAMES.VERIFY_TV, { tvId: oldTvId });
  }

  return `Tv "${tv.name}" assigned to "${file.basename}"`;
};
