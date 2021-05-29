import Queue from 'bull';
import redisConf from '../../redis.conf';

const queueInstance = new Queue('hostsMonitor', {
  redis: redisConf,
  defaultJobOptions: {
    removeOnComplete: 500,
  },
});

export default queueInstance;
