import path from 'path';
import createDebug from '../debug';
import queue from '../queues/hostsMonitor/index';

const debug = createDebug('workers/hostsMonitorWorker');

const hostsMonitorWorker = async () => {
  await queue.add({}, { repeat: { every: 2000 } });

  return new Promise<void>(resolve => {
    queue.process(path.join(__dirname, '../queues/hostsMonitor/processor.js'));

    process.on('exit', () => {
      debug('Terminating workers...');
      resolve();
    });
  });
};

export default hostsMonitorWorker;
module.exports = hostsMonitorWorker; // @todo remove me
