const debug = require('../debug')('server');
const app = require('../app');
const torrentsQueue = require('../queues/sseTorrents/index');
const processTorrentsQueue = require('../queues/sseTorrents/processor');

module.exports = async () => {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    debug('Listening on %i', port);
  });

  torrentsQueue.process('*', processTorrentsQueue);

  const close = () => server.close();
  process.once('SIGINT', close);
  process.once('SIGTERM', close);
};
