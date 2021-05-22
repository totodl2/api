import app from '../app';
import createDebug from '../debug';
import torrentsQueue from '../queues/sse/index';
import processSseQueue from '../queues/sse/processor';

const debug = createDebug('server');

const runServer = async () => {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    debug('Listening on %i', port);
  });

  torrentsQueue.process('*', processSseQueue);
  const close = () => server.close();
  process.once('SIGINT', close);
  process.once('SIGTERM', close);
};

export default runServer;
module.exports = runServer; // @todo remove me
