const EventEmitter = require('events');
const Client = require('./client');

/**
 * @param {Number|null} pingInterval
 * @returns {{send: *, middleware: *}}
 */
const createSSE = ({ pingInterval = 5000 } = {}) => {
  const emitter = new EventEmitter();

  const middleware = function(ctx) {
    const client = new Client(ctx, emitter, pingInterval);
    ctx.body = client;
  };

  const sendData = (name, data) => emitter.emit('event', name, data);

  return {
    send: sendData,
    middleware,
  };
};

module.exports = createSSE;
