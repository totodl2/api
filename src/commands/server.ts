import app from '../app';
import debugFactory from '../debug';
import torrentsQueue from '../queues/sse/index';
import processSseQueue from '../queues/sse/processor';

const debug = debugFactory('server');

// todo: use export once all commands are migrated
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
