const path = require('path');
const debug = require('debug')('api/workers/torrentsWorker');
const queue = require('../queues/torrents/index');

const DEFAULT_NB_PROCESS = 2;

module.exports = () => {
  const processArgs = process.argv.filter(
    arg => arg.substr(0, 9) === '--process',
  );
  const processes = processArgs.length
    ? parseInt(processArgs[0].split('=')[1], 10)
    : DEFAULT_NB_PROCESS;

  return new Promise(resolve => {
    queue.process(
      '*',
      processes,
      path.join(__dirname, '../queues/torrents/processor.js'),
    );

    process.on('exit', () => {
      debug('Terminating workers...');
      resolve();
    });
  });
};
