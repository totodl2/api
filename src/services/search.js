const get = require('lodash.get');

const client = require('../meilisearch');
const debug = require('../debug')('search');

const INDEX_NAME = 'data';

const TYPES = {
  MOVIE: 1,
  TV_SHOW: 2,
  TORRENT: 3,
  FILE: 4,
};

async function createIndex() {
  debug('Create index');
  await client.createIndex(INDEX_NAME, { primaryKey: 'id' });
  await client.index(INDEX_NAME).updateAttributesForFaceting(['genres']);
  await client
    .index(INDEX_NAME)
    .updateSearchableAttributes([
      'name',
      'originalName',
      'overview',
      'genres',
      'keywords',
      'files',
      'cast',
      'uploader',
      'directory',
      'torrentName',
      'extension',
      'type',
    ]);
  await client
    .index(INDEX_NAME)
    .updateRankingRules([
      'typo',
      'words',
      'proximity',
      'attribute',
      'wordsPosition',
      'exactness',
      'asc(type)',
      'asc(seasonNumber)',
      'asc(episodeNumber)',
    ]);
}

async function deleteIndex() {
  debug('Delete index');
  return client.deleteIndex(INDEX_NAME);
}

/**
 * @param Movie movie
 * @returns {Promise<void>}
 */
async function addMovie(movie) {
  const files = await movie.getFiles();

  const document = {
    id: `movie-${movie.id}`,
    originalId: movie.id,
    name: movie.title,
    originalName: movie.originalTitle,
    overview: movie.overview,
    genres: (await movie.getGenres()).map(genre => genre.name),
    keywords: movie.keywords.map(k => k.name).join(','),
    files: files.map(file => file.name).join(','),
    releaseDate: movie.releaseDate,
    cast: get(movie, 'credits.cast', [])
      .map(cast => cast.person.name)
      .join(','),
    type: TYPES.MOVIE,
    createdAt: movie.createdAt,
    posterPath: movie.posterPath,
  };

  debug('Insert movie document %o', document);
  await client.index(INDEX_NAME).addDocuments([document]);
}

/**
 * @param TvShow tvShow
 * @returns {Promise<void>}
 */
async function addTvShow(tvShow) {
  const files = await tvShow.getFiles();

  const document = {
    id: `tv-show-${tvShow.id}`,
    originalId: tvShow.id,
    name: tvShow.name,
    originalName: tvShow.name,
    overview: tvShow.overview,
    genres: (await tvShow.getGenres()).map(genre => genre.name),
    keywords: tvShow.keywords.map(k => k.name).join(','),
    files: files.map(file => file.name).join(','),
    lastAirDate: tvShow.lastAirDate,
    cast: get(tvShow, 'credits.cast', [])
      .map(cast => cast.person.name)
      .join(','),
    type: TYPES.TV_SHOW,
    createdAt: tvShow.createdAt,
    posterPath: tvShow.posterPath,
  };

  debug('Insert tv show document %o', document);
  await client.index(INDEX_NAME).addDocuments([document]);
}

/**
 * @param File file
 * @returns {Promise<void>}
 */
async function addFile(file) {
  const isTvShow = !!file.tvId;
  const torrent = await file.getTorrent();
  const document = {
    id: `file-${file.id}`,
    originalId: file.id,
    name: file.basename,
    keywords: (isTvShow
      ? [
          `S${file.seasonNumber
            .toString()
            .padStart(2, '0')}E${file.episodeNumber
            .toString()
            .padStart(2, '0')}`,
          `S${file.seasonNumber.toString()}E${file.episodeNumber.toString()}`,
          `${file.seasonNumber
            .toString()
            .padStart(2, '0')}x${file.episodeNumber
            .toString()
            .padStart(2, '0')}`,
          `${file.seasonNumber.toString()}x${file.episodeNumber.toString()}`,
        ]
      : []
    ).join(','),
    directory: file.directory,
    torrentName: torrent.name,
    extension: file.extension,
    createdAt: file.createdAt,
    type: TYPES.FILE,
    episodeNumber: file.episodeNumber,
    seasonNumber: file.seasonNumber,
  };

  debug('Insert file document %o', document);
  await client.index(INDEX_NAME).addDocuments([document]);
}

/**
 * @param Torrent torrent
 * @returns {Promise<void>}
 */
async function addTorrent(torrent) {
  const files = await torrent.getFiles();
  const uploader = await torrent.getUser();
  const document = {
    id: `torrent-${torrent.hash}`,
    hash: torrent.hash,
    name: torrent.name,
    uploader: uploader ? uploader.nickname : null,
    createdAt: torrent.createdAt,
    type: TYPES.TORRENT,
  };

  debug('Insert torrent document %o', document);
  await client.index(INDEX_NAME).addDocuments([document]);

  for (let i = 0, sz = files.length; i < sz; i++) {
    await addFile(files[i]);
  }
}

async function deleteFile(file) {
  debug('Delete file document %s', file.id);
  await client.index(INDEX_NAME).deleteDocument(`file-${file.id}`);
}

async function deleteTorrent(torrent) {
  debug('Delete torrent document %s', torrent.hash);
  await client.index(INDEX_NAME).deleteDocument(`torrent-${torrent.hash}`);
}

async function deleteTvShow(tvShow) {
  debug('Delete tv show document %d', tvShow.id);
  await client.index(INDEX_NAME).deleteDocument(`tv-show-${tvShow.id}`);
}

async function deleteMovie(movie) {
  debug('Delete movie document %d', movie.id);
  await client.index(INDEX_NAME).deleteDocument(`movie-${movie.id}`);
}

module.exports = {
  createIndex,
  deleteIndex,
  addMovie,
  addTvShow,
  addFile,
  addTorrent,
  deleteFile,
  deleteTorrent,
  deleteTvShow,
  deleteMovie,
  TYPES,
};
