import { FileInstance } from '../../models/files';

import Files from '../../services/files';
import Metadata from '../../services/metadata';
import Tv from '../../services/tv';
import Search from '../../services/search';
import queue from './index';
import convertDate from '../../utils/convertDate';
import { Types } from './types';

const REFRESH_DELAY = 24 * 60 * 60 * 1000; // 1 days

const assignTv = async (
  file: FileInstance,
  tvId: number,
  seasonNumber: number,
  episodeNumber: number,
) => {
  let tv = await Tv.get(tvId);

  if (!tv) {
    const metadata = await Metadata.getTv(tvId);
    tv = await Tv.create({
      ...metadata,
      id: parseInt(metadata.id, 10),
      lastAirDate: convertDate(metadata.lastAirDate),
    });
  }

  if (
    !Tv.hasEpisode(tv, seasonNumber, episodeNumber) &&
    tv.updatedAt.getTime() + REFRESH_DELAY < Date.now()
  ) {
    const newMetadata = await Metadata.getTv(tvId);
    tv = await Tv.update(tv, {
      ...newMetadata,
      id: parseInt(newMetadata.id, 10),
      lastAirDate: convertDate(newMetadata.lastAirDate),
    });
  }

  const { tvId: oldTvId } = file;
  await Files.setTv(file, tv, seasonNumber, episodeNumber);

  await Search.addTvShow(tv);
  await Search.addFile(file);

  if (oldTvId) {
    await queue.add(Types.VERIFY_TV, { tvId: oldTvId });
  }

  return `Tv "${tv.name}" assigned to "${file.basename}"`;
};

module.exports = assignTv; // @todo : remove me
export default assignTv;
