import get from 'lodash.get';

import client from '../meilisearch';
import debugFactory from '../debug';
import { MovieInstance } from '../models/movies';
import { CastType } from '../types/MetadataTypes';
import { TvInstance } from '../models/tv';
import { FileInstance } from '../models/files';
import { TorrentInstance } from '../models/torrents';

const debug = debugFactory('search');

const INDEX_NAME = 'data';

export enum ResultTypes {
  MOVIE = 'movie',
  TV_SHOW = 'tv',
  TORRENT = 'torrent',
  FILE = 'file',
}

enum Weights {
  MOVIE = 1,
  TV_SHOW = 1,
  TORRENT = 3,
  FILE = 4,
}

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
 * Index a movieInstance
 * @param movie
 */
async function addMovie(movie: MovieInstance) {
  const files = await movie.getFiles();

  const document = {
    documentId: `movie-${movie.id}`,
    id: movie.id,
    name: movie.title,
    originalName: movie.originalTitle,
    overview: movie.overview,
    keywords: (movie.keywords || []).map(k => k.name).join(','),
    genres: (await movie.getGenres()).map(genre => genre.name),
    files: files.map(file => file.name).join(','),
    releaseDate: movie.releaseDate,
    cast: (get(movie, 'credits.cast', []) as CastType[])
      .map(cast => cast.person.name)
      .join(','),
    type: ResultTypes.MOVIE,
    weight: Weights.MOVIE,
    createdAt: movie.createdAt,
    posterPath: movie.posterPath,
  };

  debug('Insert movie document %o', document);
  await client.index(INDEX_NAME).addDocuments([document]);
}

/**
 * Index a new tv show
 * @param tvShow
 */
async function addTvShow(tvShow: TvInstance) {
  const files = await tvShow.getFiles();

  const document = {
    documentId: `tv-show-${tvShow.id}`,
    id: tvShow.id,
    name: tvShow.name,
    episodesNumbers: (tvShow.seasons || [])
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
    keywords: (tvShow.keywords || []).map(k => k.name).join(','),
    genres: (await tvShow.getGenres()).map(genre => genre.name),
    files: files.map(file => file.name).join(','),
    lastAirDate: tvShow.lastAirDate,
    cast: (get(tvShow, 'credits.cast', []) as CastType[])
      .map(cast => cast.person.name)
      .join(','),
    type: ResultTypes.TV_SHOW,
    weight: Weights.TV_SHOW,
    createdAt: tvShow.createdAt,
    posterPath: tvShow.posterPath,
  };

  debug('Insert tv show document %o', document);
  await client.index(INDEX_NAME).addDocuments([document]);
}

/**
 * Get file object to index
 */
async function getFileDocument(file: FileInstance) {
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
        ? `S${file
            .seasonNumber!.toString()
            .padStart(2, '0')}E${file
            .episodeNumber!.toString()
            .padStart(2, '0')}`
        : null,
    hash: torrent.hash,
    extension: file.extension,
    createdAt: file.createdAt,
    type: ResultTypes.FILE,
    weight: Weights.FILE,
    torrentName: torrent.name,
    episodeNumber: file.episodeNumber,
    seasonNumber: file.seasonNumber,
  };
}

/**
 * Index file
 */
async function addFile(file: FileInstance) {
  const document = await getFileDocument(file);
  debug('Insert file document %o', document);
  await client.index(INDEX_NAME).addDocuments([document]);
}

/**
 * Index a torrent
 */
async function addTorrent(torrent: TorrentInstance) {
  const files = await torrent.getFiles();
  const uploader = await torrent.getUser();
  const documents: any[] = [
    {
      documentId: `torrent-${torrent.hash}`,
      hash: torrent.hash,
      name: torrent.name,
      uploader: uploader ? uploader.nickname : null,
      createdAt: torrent.createdAt,
      type: ResultTypes.TORRENT,
      weight: Weights.TORRENT,
    },
  ];

  for (let i = 0, sz = files.length; i < sz; i++) {
    documents.push(await getFileDocument(files[i]));
  }

  debug("Insert torrent's file documents %o", documents);
  await client.index(INDEX_NAME).addDocuments(documents);
}

/**
 * Remove file from index
 */
async function deleteFile(id: string) {
  debug('Delete file document %s', id);
  await client.index(INDEX_NAME).deleteDocument(`file-${id}`);
}

/**
 * remove torrent from index
 */
async function deleteTorrent(hash: string) {
  debug('Delete torrent document %s', hash);
  await client.index(INDEX_NAME).deleteDocument(`torrent-${hash}`);
}

/**
 * remove tv show form index
 */
async function deleteTvShow(tvShowId: number) {
  debug('Delete tv show document %d', tvShowId);
  await client.index(INDEX_NAME).deleteDocument(`tv-show-${tvShowId}`);
}

/**
 * remove movie from index
 */
async function deleteMovie(movieId: number) {
  debug('Delete movie document %d', movieId);
  await client.index(INDEX_NAME).deleteDocument(`movie-${movieId}`);
}

/**
 * Search in index
 */
async function search(keywords: string) {
  return client.index(INDEX_NAME).search(keywords);
}

const SearchService = {
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
};

export default SearchService;
