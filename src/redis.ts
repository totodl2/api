import util from 'util';
import redis from 'redis';
import { captureException } from '@sentry/node';

export const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : undefined,
  password: process.env.REDIS_PASSWORD,
});

client.on('error', err => {
  console.log('Error ', err); // eslint-disable-line
  captureException(err);
  process.exit(1);
});

export const hset = util.promisify(client.hset).bind(client);
export const hget = util.promisify(client.hget).bind(client);
export const get = util.promisify(client.get).bind(client);
export const set = util.promisify(client.set).bind(client);
export const setex = util.promisify(client.setex).bind(client);

const all = {
  /**
   * @deprecated
   */
  client,
  /**
   * @deprecated
   */
  hset,
  /**
   * @deprecated
   */
  hget,
  /**
   * @deprecated
   */
  get,
  /**
   * @deprecated
   */
  set,
  /**
   * @deprecated
   */
  setex,
};

/**
 * @deprecated
 */
module.exports = all;

export default all;
