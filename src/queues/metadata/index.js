const Queue = require('bull');

const QUEUE_NAMES = {
  FILE_ANALYZE: 'file.analyze', // it will analyze the given file
  ASSIGN_MOVIE: 'movie.assign', // assign movie to file
  VERIFY_MOVIE: 'movie.verify', // it will check if there is files associated with the given movie
  VERIFY_TV: 'tv.verify', // it will check if there is files associated with the given tv show
  ASSIGN_TV: 'tv.assign', // assign tv show to file
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
