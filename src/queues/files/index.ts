import Queue from 'bull';
import redisConf from '../../redis.conf';

const queueInstance = new Queue('file', {
  redis: redisConf,
});

export default queueInstance;
