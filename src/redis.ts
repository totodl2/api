import util from 'util';
import redis from 'redis';
import Sentry from '@sentry/node';

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : undefined,
  password: process.env.REDIS_PASSWORD,
});

client.on('error', err => {
  console.log('Error ', err); // eslint-disable-line
  Sentry.captureException(err);
  process.exit(1);
});

export default {
  client,
  hset: util.promisify(client.hset).bind(client),
  hget: util.promisify(client.hget).bind(client),
  get: util.promisify(client.get).bind(client),
  set: util.promisify(client.set).bind(client),
  setex: util.promisify(client.setex).bind(client),
};
