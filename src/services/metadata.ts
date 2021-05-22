// @ts-ignore
import createResolvers from 'tmdb-graphql/src/gql/resolvers';
// @ts-ignore
import createObjects from 'tmdb-graphql/src/gql/objects';
// @ts-ignore
import createQueries from 'tmdb-graphql/src/gql/createQueries';
// @ts-ignore
import createSchema from 'tmdb-graphql/src/gql/createSchema';
// @ts-ignore
import createApi from 'tmdb-graphql/src/api/tmdb';
import guessit from 'guessit-exec';

import metadataQueue from '../queues/metadata/index';
import { Types as MetadataQueueTypes } from '../queues/metadata/types';

import redis from '../redis';
import lowerToCamel from './transformers/lowerToCamel';
import { FileAttributes, FileInstance } from '../models/files';
import {
  ConfigurationType,
  MovieType,
  SearchMovieType,
  SearchTvType,
  TvType,
} from '../types/MetadataTypes';

const CACHE_EXPIRATION = 60 * 60 * 24;
const CONFIGURATION_CACHE_KEY = 'toto_tmdb_configuration';

const defaultMediaExtensions = [
  '3g2',
  '3gp',
  '3gp2',
  'asf',
  'avi',
  'divx',
  'flv',
  'm4v',
  'mk2',
  'mka',
  'mkv',
  'mov',
  'mp4',
  'mp4a',
  'mpeg',
  'mpg',
  'ogv',
  'qt',
  'ra',
  'ram',
  'rm',
  'ts',
  'webm',
  'wmv',
  'iso',
  'vob',
];

export enum MetadataTypes {
  MOVIE = 'movie',
  EPISODE = 'episode',
}

export class Metadata {
  /**
   * @deprecated
   */
  static TYPES: { MOVIE: string; EPISODE: string }; // @todo: remove me

  public enabled: boolean;

  public supportedExtensions: string[];

  private tmdb: ReturnType<typeof createApi>;

  constructor(
    enabled?: boolean | null,
    supportedExtensions: string[] = defaultMediaExtensions,
  ) {
    this.enabled = !!enabled;
    this.supportedExtensions = supportedExtensions.map(ext =>
      ext.toLowerCase(),
    );

    if (!this.enabled) {
      return;
    }

    const api = createApi(process.env.TMDB_API_KEY);
    const apiOptions: {
      language?: string;
      // eslint-disable-next-line camelcase
      include_image_language?: string;
    } = {};

    if (process.env.TMDB_LANGUAGE) {
      apiOptions.language = process.env.TMDB_LANGUAGE;
    }

    if (process.env.TMDB_IMAGE_LANGUAGE) {
      apiOptions.include_image_language = process.env.TMDB_IMAGE_LANGUAGE;
    }

    const resolvers = createResolvers(api, apiOptions);
    const objects = createObjects(resolvers);

    const schema = createSchema(resolvers, objects);
    this.tmdb = createQueries(schema);
  }

  /**
   * Guess media informations from filename
   */
  async inspect(filename: string) {
    return guessit(filename);
  }

  /**
   * Check if we can retrieve metadata for this file type
   */
  support(extension?: string | null): boolean {
    if (extension) {
      return this.supportedExtensions.includes(extension.toLowerCase());
    }
    return false;
  }

  /**
   * Remove metadata from file
   */
  async remove(file: FileInstance) {
    const { movieId, tvId } = file;

    if (movieId) {
      await file.update({ movieId: null });
      await metadataQueue.add(MetadataQueueTypes.VERIFY_MOVIE, { movieId });
      return true;
    }

    if (tvId) {
      await file.update({
        tvId: null,
        episodeNumber: null,
        seasonNumber: null,
      });
      await metadataQueue.add(MetadataQueueTypes.VERIFY_TV, { tvId });
      return true;
    }

    return false;
  }

  /**
   * Assign movie to file
   */
  async assignMovie(fileId: string, movieId: number) {
    return metadataQueue.add(MetadataQueueTypes.ASSIGN_MOVIE, {
      fileId,
      movieId,
    });
  }

  /**
   * Assign tv episode to file
   */
  assignTv(
    fileId: string,
    tvId: number,
    seasonNumber: number,
    episodeNumber: number,
  ) {
    return metadataQueue.add(MetadataQueueTypes.ASSIGN_TV, {
      fileId,
      tvId,
      seasonNumber,
      episodeNumber,
    });
  }

  /**
   * Get movies list matching title
   */
  async searchMovie(title: string) {
    return lowerToCamel(
      await this.tmdb.searchMovie(title),
    ) as SearchMovieType[];
  }

  /**
   * Get tv list matching title
   */
  async searchTv(title: string) {
    return lowerToCamel(await this.tmdb.searchTv(title)) as SearchTvType[];
  }

  /**
   * Get all movies info
   */
  async getMovie(id: number) {
    return lowerToCamel(await this.tmdb.getMovie(id)) as MovieType;
  }

  /**
   * Get all tv info
   */
  async getTv(id: number) {
    return lowerToCamel(await this.tmdb.getTv(id)) as TvType;
  }

  /**
   * Get configuration
   */
  async getConfiguration() {
    const values = await redis.get(CONFIGURATION_CACHE_KEY);
    if (!values) {
      const result = lowerToCamel(
        await this.tmdb.getConfiguration(),
      ) as ConfigurationType;
      await redis.setex(
        CONFIGURATION_CACHE_KEY,
        CACHE_EXPIRATION,
        JSON.stringify(result),
      );
      return result;
    }
    return JSON.parse(values) as ConfigurationType;
  }
}

/**
 * @todo: remove me
 * @deprecated
 */
Metadata.TYPES = {
  MOVIE: 'movie',
  EPISODE: 'episode',
};

const MetadataServiceInstance = new Metadata(!!process.env.TMDB_API_KEY);

module.exports = MetadataServiceInstance; // @todo: remove me
module.exports.Metadata = Metadata; // @todo: remove me
module.exports.MetadataTypes = MetadataTypes; // @todo: remove me
export default MetadataServiceInstance;
