const queue = require('../queues/metadata/index');
const debug = require('../debug')('queueMetadata');
const { File, Sequelize } = require('../models');
const Metadata = require('../services/metadata');

const DEFAULT_MAX = 15;

module.exports = async () => {
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
          length: { [Sequelize.Op.eq]: Sequelize.col('bytesCompleted') },
        },
    limit: max,
    order: [['createdAt', 'ASC']],
  });

  for (let i = 0, sz = files.length; i < sz; i++) {
    const file = files[i];
    debug('Processing %i file %s (%s)', i, file.id, file.basename);
    await queue.add(queue.NAMES.FILE_ANALYZE, {
      objectId: file.id,
      data: file.dataValues,
    });
  }

  process.exit(0);
};
