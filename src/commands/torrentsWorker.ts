import path from 'path';
import createDebug from '../debug';
import queue from '../queues/torrents/index';

const debug = createDebug('api/workers/torrentsWorker');

const DEFAULT_NB_PROCESS = 2;

const torrentsWorker = () => {
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
      path.join(__dirname, '../queues/torrents/processor.js'),
    );

    process.on('exit', () => {
      debug('Terminating workers...');
      resolve();
    });
  });
};

export default torrentsWorker;
