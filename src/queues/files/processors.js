const debug = require('debug')('api:workers:filesWorker');
const queue = require('./index');

const { get, set } = require('../../redis');
const Files = require('../../services/files');
const Hosts = require('../../services/hosts');

const REDIS_DATE_EXPIRATION = 60 * 60;

const createFile = async ({ objectId, data: values }, host) => {
  await Files.upsert({ ...values, hostId: host.id });
  return `File ${objectId} created`;
};

const updateFile = async ({ objectId, data: { new: values } }) => {
  const file = await Files.get(objectId);
  if (!file) {
    throw new Error(`File ${objectId} not found`);
  }
  await file.update(values);

  return `File ${objectId} updated`;
};

const deleteFile = async ({ objectId }) => {
  const file = await Files.get(objectId);
  if (!file) {
    throw new Error(`File ${objectId} not found`);
  }
  await file.destroy();

  return `File ${objectId} destroyed`;
};

module.exports = async job => {
  const redisKey = `files.${job.name}.${job.data.objectId}`;
  const lastMessageDateStr = await get(redisKey);
  const currentMessageDate = new Date(job.data.date);
  debug('Processing job %d - %s - %s', job.id, job.name, job.data.objectId);

  // allow us to keep temporality in messages
  if (lastMessageDateStr && new Date(lastMessageDateStr) > currentMessageDate) {
    debug(
      'Message expired for job %d - %s - %s',
      job.id,
      job.name,
      job.data.objectId,
    );
    return 'Message expired';
  }

  await set(redisKey, job.data.date, 'EX', REDIS_DATE_EXPIRATION);

  switch (job.name) {
    case queue.NAMES.CREATED: {
      const host = await Hosts.upsert(job.data.hostId);
      return createFile(job.data, host);
    }
    case queue.NAMES.UPDATED:
      return updateFile(job.data);
    case queue.NAMES.DELETED:
      return deleteFile(job.data);
    default:
      return 'No action available for this job';
  }
};
