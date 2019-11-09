const path = require('path');
const debug = require('debug')('epf/workers/transco_cdn');
const queue = require('../queues/hostsMonitor/index');

module.exports = async () => {
  await queue.add({}, { repeat: { every: 2000 } });

  return new Promise(resolve => {
    queue.process(path.join(__dirname, '../queues/hostsMonitor/processor.js'));

    process.on('exit', () => {
      debug('Terminating workers...');
      resolve();
    });
  });
};
