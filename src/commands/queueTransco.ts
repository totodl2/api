/* eslint-disable no-await-in-loop */
import { Sequelize, Op } from 'sequelize';
import createDebug from '../debug';
import { File } from '../models';
import Transcoder from '../services/transcoder';

const debug = createDebug('queueTransco');

const DEFAULT_MAX = 15;

const queueTransco = async () => {
  const maxArgs = process.argv.filter(arg => arg.substr(0, 5) === '--max');
  const fileIdArgs = process.argv.filter(arg => arg.substr(0, 6) === '--file');

  const max = maxArgs.length
    ? parseInt(maxArgs[0].split('=')[1], 10)
    : DEFAULT_MAX;

  const fileId = fileIdArgs.length ? fileIdArgs[0].split('=')[1] : null;

  const files = await File.findAll({
    where: fileId
      ? { id: fileId }
      : {
          transcodingQueuedAt: null,
          transcodingFailedAt: null,
          transcodedAt: null,
          extension: Transcoder.compatibles,
          length: { [Op.eq]: Sequelize.col('bytesCompleted') },
        },
    limit: max,
    order: [['createdAt', 'ASC']],
  });

  for (let i = 0, sz = files.length; i < sz; i++) {
    const file = files[i];
    debug('Processing %i file %s', i, file.id);
    if (await Transcoder.transcode(file)) {
      debug('File %s queued', file.id);
    }
  }

  process.exit(0);
};

export default queueTransco;
