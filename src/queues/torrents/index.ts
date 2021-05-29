import Queue from 'bull';
import redisConf from '../../redis.conf';

const queueInstance = new Queue('torrent', {
  redis: redisConf,
});

export default queueInstance;
