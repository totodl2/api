import { Job } from 'bull';

import createDebug from '../../debug';
import metadataQueue from '../metadata';
import { Types as MetadataQueueTypes } from '../metadata/types';
import Metadata from '../../services/metadata';
import { get, set } from '../../redis';
import Files from '../../services/files';
import Hosts from '../../services/hosts';
import Transcoder from '../../services/transcoder';
import Search from '../../services/search';
import {
  BaseFileMessage,
  CreatedFileMessage,
  DeletedFileMessage,
  DownloadedFileMessage,
  FileMessageTypes,
  UpdatedFileMessage,
} from '../../types/FileMessage';
import { HostInstance } from '../../models/hosts';
import convertDate from '../../utils/convertDate';

const debug = createDebug('workers:filesWorker');
const REDIS_DATE_EXPIRATION = 60 * 60;

const createFile = async (
  { objectId, data: { createdAt, updatedAt, ...values } }: CreatedFileMessage,
  host: HostInstance,
) => {
  const file = await Files.upsert({
    ...values,
    hostId: host.id,
    createdAt: convertDate(createdAt),
    updatedAt: convertDate(updatedAt),
  });
  await Search.addFile(file);
  return `File ${objectId} created`;
};

const updateFile = async ({
  objectId,
  data: { new: values },
}: UpdatedFileMessage) => {
  const file = await Files.get(objectId);
  if (!file) {
    throw new Error(`File ${objectId} not found`);
  }
  await file.update(values);

  return `File ${objectId} updated`;
};

/**
 * @todo checker l'host, il doit être égal à celui qu'on a en DB pour valider la suppression
 * @todo Checker si le torrent n'est pas déjà en base a l'upload
 * */
const deleteFile = async ({ objectId }: DeletedFileMessage) => {
  const file = await Files.get(objectId);
  if (file) {
    if (Metadata.enabled) {
      await Metadata.remove(file);
    }
    await file.destroy();
    debug('File %o destroyed', objectId);
  }

  if (Transcoder.enabled) {
    await Transcoder.clean(objectId);
  }

  await Search.deleteFile(objectId);
  return `File ${objectId} destroyed (file exists ${file ? 'true' : 'false'})`;
};

const transcodeFile = async ({ objectId }: DownloadedFileMessage) => {
  const file = await Files.get(objectId);
  if (!file) {
    throw new Error(`File ${objectId} not found`);
  }

  if (!Transcoder.enabled) {
    return `Transcoding not enabled for ${objectId}`;
  }

  if (file.transcodingQueuedAt) {
    return `File ${objectId} already queued`;
  }

  const transcoding = await Transcoder.transcode(file);
  debug('Transcoding order emitted for %o - success %o', objectId, transcoding);

  return `File ${objectId} ${transcoding ? 'not ' : ''} queued for transcoding`;
};

const processor = async (job: Job<BaseFileMessage>) => {
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

  // @ts-ignore
  await set(redisKey, job.data.date, 'EX', REDIS_DATE_EXPIRATION);

  switch (job.name) {
    case FileMessageTypes.CREATED: {
      const message = job.data as CreatedFileMessage;
      const host = await Hosts.upsert(parseInt(message.hostId, 10));
      return createFile(message, host);
    }
    case FileMessageTypes.UPDATED:
      return updateFile((job.data as unknown) as UpdatedFileMessage);
    case FileMessageTypes.DELETED:
      return deleteFile(job.data as DeletedFileMessage);
    case FileMessageTypes.DOWNLOADED: {
      const message = job.data as DownloadedFileMessage;
      if (Metadata.enabled && Metadata.support(message.data.extension)) {
        debug(
          'Add %s (%s) to metadata queue',
          job.data.objectId,
          job.data.data.extension,
        );
        await metadataQueue.add(MetadataQueueTypes.FILE_ANALYZE, message);
      }
      return transcodeFile(message);
    }
    default:
      return 'No action available for this job';
  }
};

export default processor;
