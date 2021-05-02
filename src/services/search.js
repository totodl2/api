const get = require('lodash.get');

const client = require('../meilisearch');
const debug = require('../debug')('search');

const INDEX_NAME = 'data';

const TYPES = {
  MOVIE: 'movie',
  TV_SHOW: 'tv',
  TORRENT: 'torrent',
  FILE: 'file',
};

const WEIGHTS = {
  MOVIE: 1,
  TV_SHOW: 1,
  TORRENT: 3,
  FILE: 4,
};

async function createIndex() {
  debug('Create index');
  await client.createIndex(INDEX_NAME, { primaryKey: 'documentId' });
  await client.index(INDEX_NAME).updateAttributesForFaceting(['genres']);
  await client
    .index(INDEX_NAME)
    .updateSearchableAttributes([
      'name',
      'episodesNumbers',
      'originalName',
      'overview',
      'keywords',
      'genres',
      'files',
      'cast',
      'uploader',
      'torrentName',
      'extension',
    ]);
  await client
    .index(INDEX_NAME)
    .updateRankingRules([
      'typo',
      'words',
      'proximity',
      'asc(weight)',
      'attribute',
      'wordsPosition',
      'exactness',
      'asc(seasonNumber)',
      'asc(episodeNumber)',
    ]);
  await client
    .index(INDEX_NAME)
    .updateDisplayedAttributes([
      'id',
      'documentId',
      'name',
      'originalName',
      'overview',
      'genres',
      'releaseDate',
      'type',
      'createdAt',
      'posterPath',
      'lastAirDate',
      'torrentName',
      'extension',
      'episodeNumber',
      'seasonNumber',
      'hash',
      'uploader',
    ]);
}

async function deleteIndex() {
  debug('Delete index');
  await client.index(INDEX_NAME).deleteAllDocuments();
  return client.deleteIndex(INDEX_NAME);
}

/**
 * @param Movie movie
 * @returns {Promise<void>}
 */
async function addMovie(movie) {
  const files = await movie.getFiles();

  const document = {
    documentId: `movie-${movie.id}`,
    id: movie.id,
    name: movie.title,
    originalName: movie.originalTitle,
    overview: movie.overview,
    keywords: movie.keywords.map(k => k.name).join(','),
    genres: (await movie.getGenres()).map(genre => genre.name),
    files: files.map(file => file.name).join(','),
    releaseDate: movie.releaseDate,
    cast: get(movie, 'credits.cast', [])
      .map(cast => cast.person.name)
      .join(','),
    type: TYPES.MOVIE,
    weight: WEIGHTS.MOVIE,
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
    documentId: `tv-show-${tvShow.id}`,
    id: tvShow.id,
    name: tvShow.name,
    episodesNumbers: tvShow.seasons
      .map(season =>
        season.episodes
          .map(
            episode =>
              `S${season.seasonNumber
                .toString()
                .padStart(2, '0')}E${episode.episodeNumber
                .toString()
                .padStart(2, '0')}`,
          )
          .join(','),
      )
      .join(','),
    originalName: tvShow.name,
    overview: tvShow.overview,
    keywords: tvShow.keywords.map(k => k.name).join(','),
    genres: (await tvShow.getGenres()).map(genre => genre.name),
    files: files.map(file => file.name).join(','),
    lastAirDate: tvShow.lastAirDate,
    cast: get(tvShow, 'credits.cast', [])
      .map(cast => cast.person.name)
      .join(','),
    type: TYPES.TV_SHOW,
    weight: WEIGHTS.TV_SHOW,
    createdAt: tvShow.createdAt,
    posterPath: tvShow.posterPath,
  };

  debug('Insert tv show document %o', document);
  await client.index(INDEX_NAME).addDocuments([document]);
}

/**
 * @param File file
 * @returns {Promise<{createdAt, torrentName, extension: (string|string|*), keywords: (string|null), name: *, weight: number, documentId: string, id, seasonNumber: (number|null|*), type: string, episodeNumber, hash}>}
 */
async function getFileDocument(file) {
  const isTvShow = !!file.tvId;
  const torrent = await file.getTorrent();
  const hasEpisodeNumber =
    typeof file.seasonNumber === 'number' &&
    typeof file.episodeNumber === 'number';

  return {
    documentId: `file-${file.id}`,
    id: file.id,
    name: file.basename,
    keywords:
      isTvShow && hasEpisodeNumber
        ? `S${file.seasonNumber
            .toString()
            .padStart(2, '0')}E${file.episodeNumber
            .toString()
            .padStart(2, '0')}`
        : null,
    hash: torrent.hash,
    extension: file.extension,
    createdAt: file.createdAt,
    type: TYPES.FILE,
    weight: WEIGHTS.FILE,
    torrentName: torrent.name,
    episodeNumber: file.episodeNumber,
    seasonNumber: file.seasonNumber,
  };
}

/**
 * @param File file
 * @returns {Promise<void>}
 */
async function addFile(file) {
  const document = await getFileDocument(file);
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
  const documents = [
    {
      documentId: `torrent-${torrent.hash}`,
      hash: torrent.hash,
      name: torrent.name,
      uploader: uploader ? uploader.nickname : null,
      createdAt: torrent.createdAt,
      type: TYPES.TORRENT,
      weight: WEIGHTS.TORRENT,
    },
  ];

  for (let i = 0, sz = files.length; i < sz; i++) {
    documents.push(await getFileDocument(files[i]));
  }

  debug("Insert torrent's file documents %o", documents);
  await client.index(INDEX_NAME).addDocuments(documents);
}

async function deleteFile(id) {
  debug('Delete file document %s', id);
  await client.index(INDEX_NAME).deleteDocument(`file-${id}`);
}

async function deleteTorrent(hash) {
  debug('Delete torrent document %s', hash);
  await client.index(INDEX_NAME).deleteDocument(`torrent-${hash}`);
}

async function deleteTvShow(tvShowId) {
  debug('Delete tv show document %d', tvShowId);
  await client.index(INDEX_NAME).deleteDocument(`tv-show-${tvShowId}`);
}

async function deleteMovie(movieId) {
  debug('Delete movie document %d', movieId);
  await client.index(INDEX_NAME).deleteDocument(`movie-${movieId}`);
}

async function search(keywords) {
  return client.index(INDEX_NAME).search(keywords);
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
  search,
  TYPES,
};
