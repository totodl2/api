const EventEmitter = require('eventemitter2').EventEmitter2;
const Client = require('./client');

/**
 * @param {Number|null} pingInterval
 * @param pingInterval
 * @returns {{createRoute: (function(*): Function), send: *}}
 */
const createSSE = ({ pingInterval = 5000 } = {}) => {
  const emitter = new EventEmitter({ wildcard: true, maxListeners: 500 });
  const sendData = (name, data) => emitter.emit(name, name, data);

  return {
    send: sendData,
    /**
     * @param {function(ctx)} onInit
     * @returns {function(...[*]=)}
     */
    createRoute: onInit => ctx => {
      const client = new Client({ ctx, emitter, pingInterval, onInit });
      ctx.body = client;
    },
  };
};

module.exports = createSSE;
