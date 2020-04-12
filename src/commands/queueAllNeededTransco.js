/* eslint-disable no-await-in-loop */
const debug = require('../debug')('queueAllTransco');
const { File, Sequelize } = require('../models');
const Transcoder = require('../services/transcoder');

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
          transcodingAt: null,
          transcodedAt: null,
          extension: Transcoder.compatibles,
          length: { [Sequelize.Op.eq]: Sequelize.col('bytesCompleted') },
        },
    limit: max,
  });

  for (let i = 0, sz = files.length; i < sz; i++) {
    const file = files[i];
    debug('Processing %i file %s', i, file.id);
    if (await Transcoder.supports(file)) {
      await Transcoder.transcode(file);
      debug('File %s queued', file.id);
      await file.update({ transcodingAt: new Date() });
    }
  }

  process.exit(0);
};
