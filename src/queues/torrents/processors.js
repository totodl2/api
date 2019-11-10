const debug = require('debug')('api:workers:torrentsWorker');
const queue = require('./index');

const { get, set } = require('../../redis');
const Torrents = require('../../services/torrents');
const Hosts = require('../../services/hosts');

const REDIS_DATE_EXPIRATION = 60 * 60;

const createTorrent = async (
  { objectId, data: { files, ...values } },
  host,
) => {
  await Torrents.upsert({ ...values, hostId: host.id });
  return `Torrent ${objectId} created`;
};

const updateTorrent = async ({
  objectId,
  data: {
    new: { files, ...values },
  },
}) => {
  const torrent = await Torrents.get(objectId);
  if (!torrent) {
    throw new Error(`Torrent ${objectId} not found`);
  }
  await torrent.update(values);

  return `Torrent ${objectId} updated`;
};

const deleteTorrent = async ({ objectId }) => {
  const torrent = await Torrents.get(objectId);
  if (!torrent) {
    throw new Error(`Torrent ${objectId} not found`);
  }
  await torrent.destroy();

  return `Torrent ${objectId} destroyed`;
};

module.exports = async job => {
  const redisKey = `torrents.${job.name}.${job.data.objectId}`;
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
      const host = await Hosts.getOne(job.data.hostId);
      if (!host) {
        throw new Error('Cannot found host');
      }
      return createTorrent(job.data, host);
    }
    case queue.NAMES.UPDATED:
      return updateTorrent(job.data);
    case queue.NAMES.DELETED:
      return deleteTorrent(job.data);
    default:
      return 'No action available for this job';
  }
};
