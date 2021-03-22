const Queue = require('bull');

const QUEUE_NAMES = {
  ANALYZE: 'analyze', // it will analyze the given file
  VERIFY: 'verify', // it will check if there is files associated with the given movie
};

module.exports = new Queue('metadata', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    removeOnComplete: 500,
  },
});

module.exports.NAMES = QUEUE_NAMES;
