const util = require('util');
const redis = require('redis');
const Sentry = require('@sentry/node');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

client.on('error', function(err) {
  console.log('Error ', err); // eslint-disable-line
  Sentry.captureException(err);
  process.exit(1);
});

module.exports = {
  client,
  hset: util.promisify(client.hset).bind(client),
  hget: util.promisify(client.hget).bind(client),
  get: util.promisify(client.get).bind(client),
  set: util.promisify(client.set).bind(client),
};
