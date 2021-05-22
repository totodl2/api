import {
  NormalizableFileType,
  normalize as normalizeFiles,
  NormalizedFileType,
} from './files';
import { normalize as normalizeGenres, NormalizedGenreType } from './genres';
import {
  normalize as normalizeWatchStatus,
  NormalizedWatchStatus,
} from './watchStatus';
import { TvAttributes } from '../../models/tv';
import { GenreAttributes } from '../../models/genres';
import { WatchStatusAttributes } from '../../models/watch-status';
import { FileAttributes } from '../../models/files';

type CompleteTvType = TvAttributes & {
  genres?: GenreAttributes[];
  files?: NormalizableFileType[] | null;
  watchStatus?: WatchStatusAttributes[] | null;
};

type NormalizedTvType = TvAttributes & {
  lost: (FileAttributes | NormalizedFileType)[];
  genres: NormalizedGenreType[];
  watchStatus: NormalizedWatchStatus[];
};

const normalizeOne = ({
  files,
  genres = [],
  seasons,
  watchStatus,
  ...data
}: CompleteTvType) => {
  const founds: string[] = [];

  const tvShow: NormalizedTvType = {
    ...data,
    genres: normalizeGenres(genres) as NormalizedGenreType[],
    seasons: (seasons || [])
      .filter(season => season.seasonNumber !== 0 && season.episodes.length > 0)
      .map(({ episodes = [], ...season }) => ({
        ...season,
        episodes: episodes.map(episode => ({
          ...episode,
          files: (files || [])
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
            .map(f => normalizeFiles(f) as NormalizedFileType | FileAttributes),
        })),
      })),
    lost: [],
    watchStatus: (watchStatus || []).map(normalizeWatchStatus),
  };

  tvShow.lost = (files || [])
    .filter(file => !founds.includes(file.id))
    .map(f => normalizeFiles(f) as NormalizedFileType | FileAttributes);

  return tvShow;
};

/**
 * @param {Array<Tv>|Tv} tvList tv show
 * @return {Object}
 */
export const normalize = (tvList: CompleteTvType | CompleteTvType[]) => {
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
  lastAirDate,
}: TvAttributes) => ({
  id,
  backdropPath,
  originalName,
  popularity,
  posterPath,
  name,
  lastAirDate,
});

export const normalizeShort = (tvList: TvAttributes | TvAttributes[]) => {
  if (Array.isArray(tvList)) {
    return tvList.map(tv => normalizeOneShort(tv));
  }
  return normalizeOneShort(tvList);
};

export default { normalize, normalizeShort };
module.exports = { normalize, normalizeShort }; // @todo remove me
