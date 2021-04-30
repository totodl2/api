const debug = require('../debug')('searchIndex');
const { File, Movie, Tv, Torrent } = require('../models');
const search = require('../services/search');

const BATCH = 5;

const processBatch = async (Entity, callback, debugName) => {
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

module.exports = async () => {
  await processBatch(File, search.addFile, 'File');
  await processBatch(Movie, search.addMovie, 'Movie');
  await processBatch(Tv, search.addTvShow, 'Tv');
  await processBatch(Torrent, search.addTorrent, 'Torrent');

  process.exit(0);
};
