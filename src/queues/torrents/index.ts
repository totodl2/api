import Queue from 'bull';

/**
 * @deprecated use TorrentMessageTypes
 */
export enum QueueNames {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  DOWNLOADED = 'downloaded',
}

const queueInstance = new Queue('torrent', {
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!, 10),
    password: process.env.REDIS_PASSWORD,
  },
});

/**
 * @todo remove me
 */
module.exports = queueInstance;
/**
 * @deprecated use TorrentMessageTypes
 */
module.exports.NAMES = QueueNames;

export default queueInstance;
