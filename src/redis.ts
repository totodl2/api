import util from 'util';
import redis from 'redis';
import { captureException } from '@sentry/node';
import redisConf from './redis.conf';

export const client = redis.createClient(redisConf);

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
export default client;
