const debug = require('../debug')('server');
const app = require('../app');
const torrentsQueue = require('../queues/sse/index');
const processSseQueue = require('../queues/sse/processor');

module.exports = async () => {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    debug('Listening on %i', port);
  });

  torrentsQueue.process('*', processSseQueue);

  const close = () => server.close();
  process.once('SIGINT', close);
  process.once('SIGTERM', close);
};
