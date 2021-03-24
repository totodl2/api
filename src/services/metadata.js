const createResolvers = require('tmdb-graphql/src/gql/resolvers');
const createObjects = require('tmdb-graphql/src/gql/objects');
const createQueries = require('tmdb-graphql/src/gql/createQueries');
const createSchema = require('tmdb-graphql/src/gql/createSchema');
const createApi = require('tmdb-graphql/src/api/tmdb');
const guessit = require('guessit-exec');

const queue = require('../queues/metadata/index');
const redis = require('../redis');
const lowerToCamel = require('./transformers/lowerToCamel');

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

class Metadata {
  constructor(enabled, supportedExtensions = defaultMediaExtensions) {
    this.enabled = !!enabled;
    this.supportedExtensions = supportedExtensions.map(ext =>
      ext.toLowerCase(),
    );

    if (!this.enabled) {
      return;
    }

    const api = createApi(process.env.TMDB_API_KEY);
    const apiOptions = {};

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
   * @param filename
   * @return {Promise<{
   *  type: String,
   *  episode: Number,
   *  season: Number,
   *  title: String
   * }>}
   */
  async inspect(filename) {
    return guessit(filename);
  }

  /**
   * @param {string} extension
   * @return {boolean}
   */
  support(extension) {
    return this.supportedExtensions.includes(extension.toLowerCase());
  }

  /**
   * Remove metadata from file
   * @param {File} file
   * @return {Promise<boolean>}
   */
  async remove(file) {
    const { movieId } = file;
    if (movieId) {
      await file.update({ movieId: null });
      await queue.add(queue.NAMES.VERIFY_MOVIE, { movieId });
      return true;
    }
    return false;
  }

  /**
   * @param {File|Object} file
   * @param {Number} movieId
   * @return {Promise<Boolean>}
   */
  async assignMovie(file, movieId) {
    await queue.add(queue.NAMES.ASSIGN_MOVIE, {
      file,
      movieId,
    });
    return true;
  }

  /**
   * @param {string} title
   * @return {Promise<*>}
   */
  async searchMovie(title) {
    return lowerToCamel(await this.tmdb.searchMovie(title));
  }

  /**
   * @param {Number} id
   * @return {Promise<*>}
   */
  async getMovie(id) {
    return lowerToCamel(await this.tmdb.getMovie(id));
  }

  /**
   * @return {Promise<{Object}>}
   */
  async getConfiguration() {
    const values = await redis.get(CONFIGURATION_CACHE_KEY);
    if (!values) {
      const result = lowerToCamel(await this.tmdb.getConfiguration());
      await redis.setex(
        CONFIGURATION_CACHE_KEY,
        CACHE_EXPIRATION,
        JSON.stringify(result),
      );
      return result;
    }
    return JSON.parse(values);
  }
}

Metadata.TYPES = {
  MOVIE: 'movie',
  EPISODE: 'episode',
};

module.exports = new Metadata(!!process.env.TMDB_API_KEY);
module.exports.Metadata = Metadata;
