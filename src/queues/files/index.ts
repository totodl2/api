import Queue from 'bull';

/**
 * @deprecated use FileMessageTypes
 */
const QUEUE_NAMES = {
  CREATED: 'created',
  UPDATED: 'updated',
  DELETED: 'deleted',
  DOWNLOADED: 'downloaded',
};

const queueInstance = new Queue('file', {
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!, 10),
    password: process.env.REDIS_PASSWORD,
  },
});

/**
 * @deprecated use FileMessageTypes
 */
module.exports.NAMES = QUEUE_NAMES;

/**
 * @todo remove me
 */
module.exports = queueInstance;

export default queueInstance;
