import { Op, Sequelize } from 'sequelize';
import { Types } from '../queues/metadata/types';
import queue from '../queues/metadata';
import createDebug from '../debug';
import { File } from '../models';
import Metadata from '../services/metadata';

const debug = createDebug('queueMetadata');

const DEFAULT_MAX = 15;

const queueMetadata = async () => {
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
          extension: Metadata.supportedExtensions,
          length: { [Op.eq]: Sequelize.col('bytesCompleted') },
          tvId: null,
          movieId: null,
        },
    limit: max,
    order: [['createdAt', 'ASC']],
  });

  for (let i = 0, sz = files.length; i < sz; i++) {
    const file = files[i];
    debug('Processing %i file %s (%s)', i, file.id, file.basename);
    await queue.add(Types.FILE_ANALYZE, {
      objectId: file.id,
      data: file.dataValues,
    });
  }

  process.exit(0);
};

export default queueMetadata;
module.exports = queueMetadata; // @todo remove me
