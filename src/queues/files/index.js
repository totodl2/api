const Queue = require('bull');

const QUEUE_NAMES = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
  DOWNLOADED: 'downloaded',
};

module.exports = process.env.REDIS_HOST
  ? new Queue('file', {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    })
  : null;

module.exports.NAMES = QUEUE_NAMES;
