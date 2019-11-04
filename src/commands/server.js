const debug = require('../debug')('server');
const app = require('../app');

module.exports = async () => {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    debug('Listening on %i', port);
  });

  const close = () => server.close();
  process.once('SIGINT', close);
  process.once('SIGTERM', close);
};
