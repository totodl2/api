const debug = require('debug')('api:workers:torrentsWorker');
const queue = require('./index');

const { get, set } = require('../../redis');
const Torrents = require('../../services/torrents');
const Hosts = require('../../services/hosts');
const Users = require('../../services/users');
const Search = require('../../services/search');

const REDIS_DATE_EXPIRATION = 60 * 60;

const createTorrent = async (
  { objectId, data: { files, ...values } },
  host,
) => {
  const torrent = await Torrents.upsert({ ...values, hostId: host.id });
  const user = await torrent.getUser();
  if (user) {
    await Users.updateSpaceUsage(user);
  }
  await Search.addTorrent(torrent);
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

  if (
    parseInt(torrent.previous('totalSize'), 10) !==
    parseInt(values.totalSize, 10)
  ) {
    const user = await torrent.getUser();
    if (user) {
      await Users.updateSpaceUsage(user);
    }
  }

  return `Torrent ${objectId} updated`;
};

const deleteTorrent = async ({ objectId }) => {
  const torrent = await Torrents.get(objectId);
  if (!torrent) {
    throw new Error(`Torrent ${objectId} not found`);
  }

  await Search.deleteTorrent(objectId);
  const user = await torrent.getUser();
  await torrent.destroy();

  if (user) {
    await Users.updateSpaceUsage(user);
  }

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
      const host = await Hosts.upsert(job.data.hostId);
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
