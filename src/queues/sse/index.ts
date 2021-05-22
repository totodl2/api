import Queue from 'bull';

export const Types = {
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
  USERS: {
    UPDATED: 'users.$id.updated',
  },
};

const queueInstance = new Queue('sse', {
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!, 10),
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 0,
    timeout: 100,
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

module.exports = queueInstance;
module.exports.NAMES = Types; // @deprecated use import { Types }

export default queueInstance;
