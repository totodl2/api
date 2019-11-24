const Queue = require('bull');

const QUEUE_NAMES = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
  DOWNLOADED: 'downloaded',
};

module.exports = new Queue('file', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

module.exports.NAMES = QUEUE_NAMES;
