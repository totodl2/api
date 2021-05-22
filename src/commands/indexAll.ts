import createDebug from '../debug';
import { Movie, Tv, Torrent } from '../models';
import search from '../services/search';

const debug = createDebug('searchIndex');

const BATCH = 5;

const processBatch = async (
  Entity: { findAndCountAll: (params: any) => any },
  callback: (row: any) => void,
  debugName: string,
) => {
  for (let offset = 0, count = 1; offset < count; ) {
    const { rows, count: dbCount } = await Entity.findAndCountAll({
      offset,
      limit: BATCH,
    });

    if (!rows) {
      return;
    }

    offset += rows.length;
    count = dbCount;

    for (let j = 0, sz = rows.length; j < sz; j++) {
      debug('Processing entity %s id %s', debugName, rows[j].id);
      await callback(rows[j]);
    }
  }
};

const indexAll = async () => {
  await processBatch(Movie, search.addMovie, 'Movie');
  await processBatch(Tv, search.addTvShow, 'Tv');
  await processBatch(Torrent, search.addTorrent, 'Torrent');

  process.exit(0);
};

export default indexAll;
module.exports = indexAll; // @todo remove me
