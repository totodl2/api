import { Job } from 'bull';

import createDebug from '../../debug';
import { get, set } from '../../redis';
import Torrents from '../../services/torrents';
import Hosts from '../../services/hosts';
import Users from '../../services/users';
import Search from '../../services/search';
import {
  BaseTorrentMessage,
  CreatedTorrentMessage,
  DeletedTorrentMessage,
  TorrentMessageTypes,
  UpdatedTorrentMessage,
} from '../../types/TorrentMessage';
import { HostInstance } from '../../models/hosts';
import convertDate from '../../utils/convertDate';

const debug = createDebug('workers:torrentsWorker');

const REDIS_DATE_EXPIRATION = 60 * 60;

const createTorrent = async (
  {
    objectId,
    data: { files, createdAt, updatedAt, ...values },
  }: CreatedTorrentMessage,
  host: HostInstance,
) => {
  const torrent = await Torrents.upsert({
    ...values,
    hostId: host.id,
    createdAt: convertDate(createdAt),
    updatedAt: convertDate(updatedAt),
  });
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
}: UpdatedTorrentMessage) => {
  const torrent = await Torrents.get(objectId);
  if (!torrent) {
    throw new Error(`Torrent ${objectId} not found`);
  }
  await torrent.update(values);

  if (
    parseInt(torrent.previous('totalSize')! as string, 10) !==
    parseInt(values.totalSize! as string, 10)
  ) {
    const user = await torrent.getUser();
    if (user) {
      await Users.updateSpaceUsage(user);
    }
  }

  return `Torrent ${objectId} updated`;
};

const deleteTorrent = async ({ objectId }: DeletedTorrentMessage) => {
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

const processor = async (job: Job<BaseTorrentMessage>) => {
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

  // @ts-ignore
  await set(redisKey, job.data.date, 'EX', REDIS_DATE_EXPIRATION);

  switch (job.name) {
    case TorrentMessageTypes.CREATED: {
      const message = job.data as CreatedTorrentMessage;
      const host = await Hosts.upsert(parseInt(message.hostId, 10));
      return createTorrent(message, host);
    }
    case TorrentMessageTypes.UPDATED:
      return updateTorrent((job.data as unknown) as UpdatedTorrentMessage);
    case TorrentMessageTypes.DELETED:
      return deleteTorrent(job.data as DeletedTorrentMessage);
    default:
      return 'No action available for this job';
  }
};

/**
 * @todo: remove me
 */
module.exports = processor;
export default processor;
