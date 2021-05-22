import Queue from 'bull';

const queueInstance = new Queue('hostsMonitor', {
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!, 10),
    password: process.env.REDIS_PASSWORD,
  },
  defaultJobOptions: {
    removeOnComplete: 500,
  },
});

/**
 * @todo : remove me
 */
module.exports = queueInstance;
export default queueInstance;
