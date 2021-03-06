const { normalize: normalizeFiles } = require('./files');
const { normalize: normalizeGenres } = require('./genres');
const { normalize: normalizeWatchStatus } = require('./watchStatus');

/**
 * @param {File[]} files
 * @param {Genre[]} genres
 * @param {Array} seasons
 * @param {WatchStatus[]} watchStatus
 * @param data
 * @return {*&{genres: *, files: *}}
 */
const normalizeOne = ({
  files = [],
  genres = [],
  seasons = [],
  watchStatus = [],
  ...data
}) => {
  const founds = [];
  const tvShow = {
    ...data,
    genres: normalizeGenres(genres),
    seasons: seasons
      .filter(season => season.seasonNumber !== 0 && season.episodes.length > 0)
      .map(({ episodes = [], ...season }) => ({
        ...season,
        episodes: episodes.map(episode => ({
          ...episode,
          files: files
            .filter(file => {
              const found =
                file.tvId === data.id &&
                file.seasonNumber === season.seasonNumber &&
                file.episodeNumber === episode.episodeNumber;
              if (found) {
                founds.push(file.id);
              }
              return found;
            })
            .map(normalizeFiles),
        })),
      })),
  };
  tvShow.lost = files
    .filter(file => !founds.includes(file.id))
    .map(normalizeFiles);
  tvShow.watchStatus = watchStatus.map(normalizeWatchStatus);
  return tvShow;
};

/**
 * @param {Array<Tv>|Tv} tvList tv show
 * @return {Object}
 */
const normalize = tvList => {
  if (Array.isArray(tvList)) {
    return tvList.map(tv => normalizeOne(tv));
  }
  return normalizeOne(tvList);
};

const normalizeOneShort = ({
  id,
  backdropPath,
  originalName,
  popularity,
  posterPath,
  name,
  releaseDate,
}) => ({
  id,
  backdropPath,
  originalName,
  popularity,
  posterPath,
  name,
  releaseDate,
});

const normalizeShort = tvList => {
  if (Array.isArray(tvList)) {
    return tvList.map(tv => normalizeOneShort(tv));
  }
  return normalizeOneShort(tvList);
};

module.exports = { normalize, normalizeShort };
