const Queue = require('bull');

module.exports = process.env.REDIS_HOST
  ? new Queue('hostsMonitor', {
      redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: 500,
      },
    })
  : null;
