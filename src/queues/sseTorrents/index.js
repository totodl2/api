const Queue = require('bull');

const QUEUE_NAMES = {
  TORRENTS: {
    CREATED: 'torrents.created',
    UPDATED: 'torrents.updated',
    DELETED: 'torrents.deleted',
    DOWNLOADED: 'torrents.downloaded',
  },
  FILES: {
    CREATED: 'files.created',
    UPDATED: 'files.updated',
    DELETED: 'files.deleted',
    DOWNLOADED: 'files.downloaded',
  },
};

module.exports = new Queue('sse-torrents', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 0,
    timeout: 100,
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

module.exports.NAMES = QUEUE_NAMES;
