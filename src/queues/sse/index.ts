import Queue from 'bull';
import redisConf from '../../redis.conf';

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
  redis: redisConf,
  defaultJobOptions: {
    attempts: 0,
    timeout: 100,
    removeOnComplete: 100,
    removeOnFail: 100,
  },
});

export default queueInstance;
