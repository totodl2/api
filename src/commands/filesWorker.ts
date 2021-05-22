import path from 'path';
import createDebug from '../debug';
import queue from '../queues/files/index';

const debug = createDebug('workers/filesWorker');

const DEFAULT_NB_PROCESS = 2;

const filesWorker = () => {
  const processArgs = process.argv.filter(
    arg => arg.substr(0, 9) === '--process',
  );
  const processes = processArgs.length
    ? parseInt(processArgs[0].split('=')[1], 10)
    : DEFAULT_NB_PROCESS;

  return new Promise<void>(resolve => {
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

module.exports = filesWorker; // @todo remove me
export default filesWorker;
