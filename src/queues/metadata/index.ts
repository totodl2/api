import Queue from 'bull';
import { Types } from './types';

const queueInstance = new Queue('metadata', {
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!, 10),
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    removeOnComplete: 500,
  },
});

module.exports = queueInstance;
/**
 * @deprecated use import { Types } from './types'
 */
module.exports.NAMES = Types;

export default queueInstance;
