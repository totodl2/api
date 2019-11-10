const path = require('path');
const debug = require('debug')('api/workers/filesWorker');
const queue = require('../queues/files/index');

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
      path.join(__dirname, '../queues/files/processors.js'),
    );

    process.on('exit', () => {
      debug('Terminating workers...');
      resolve();
    });
  });
};
