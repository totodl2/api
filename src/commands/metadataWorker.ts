import path from 'path';
import createDebug from 'debug';
import queue from '../queues/metadata/index';

const debug = createDebug('workers/metadataWorker');

const DEFAULT_NB_PROCESS = 1;

const metadataWorker = () => {
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
      path.join(__dirname, '../queues/metadata/processor.js'),
    );

    process.on('exit', () => {
      debug('Terminating workers...');
      resolve();
    });
  });
};

export default metadataWorker;
