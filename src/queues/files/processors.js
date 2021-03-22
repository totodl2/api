const debug = require('debug')('api:workers:filesWorker');
const queue = require('./index');

const metadataQueue = require('../metadata');
const Metadata = require('../../services/metadata');
const { get, set } = require('../../redis');
const Files = require('../../services/files');
const Hosts = require('../../services/hosts');
const Transcoder = require('../../services/transcoder');

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

/**
 * @todo checker l'host, il doit être égal à celui qu'on a en DB pour valider la suppression
 * @todo Checker si le torrent n'est pas déjà en base a l'upload
 * */
const deleteFile = async ({ objectId }) => {
  const file = await Files.get(objectId);
  if (file) {
    const { movieId } = file.dataValues;
    await file.destroy();
    debug('File %o not found', objectId);

    if (Metadata.enabled) {
      if (movieId) {
        await metadataQueue.add(metadataQueue.NAMES.VERIFY, { movieId });
      }
      // todo: check for tv show
    }
  }

  if (Transcoder.enabled) {
    await Transcoder.clean(objectId);
  }

  return `File ${objectId} destroyed`;
};

const transcodeFile = async ({ objectId }) => {
  const file = await Files.get(objectId);
  if (!file) {
    throw new Error(`File ${objectId} not found`);
  }

  if (!Transcoder.enabled || !Transcoder.isCompatible(file)) {
    return `Transcoding not enabled or compatible ${objectId}`;
  }

  if (file.transcodingQueuedAt) {
    return `File ${objectId} already queued`;
  }

  const supported = await Transcoder.supports(file);
  debug('Transcoder support : %o for %o', supported, objectId);

  if (!supported) {
    return `Transcoder not supporting file ${objectId}`;
  }

  await Transcoder.transcode(file);
  debug('Transcoding order emitted for %o', objectId);

  await file.update({ transcodingQueuedAt: new Date() });

  return `File ${objectId} queued for transcoding`;
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
    case queue.NAMES.DOWNLOADED: {
      if (Metadata.enabled && Metadata.support(job.data.data.extension)) {
        debug(
          'Add %s (%s) to metadata queue',
          job.data.objectId,
          job.data.data.extension,
        );
        metadataQueue.add(metadataQueue.NAMES.ANALYZE, job.data);
      }
      return transcodeFile(job.data);
    }
    default:
      return 'No action available for this job';
  }
};
