import { Context } from 'koa';
import { EventEmitter2 } from 'eventemitter2';
import Client from './client';

/**
 * @param {Number|null} pingInterval
 * @param pingInterval
 * @returns {{createRoute: (function(*): Function), send: *}}
 */
const createSSE = ({ pingInterval = 5000 } = {}) => {
  const emitter = new EventEmitter2({ wildcard: true, maxListeners: 500 });
  const sendData = (name: string, data: any) => emitter.emit(name, name, data);

  return {
    send: sendData,
    /**
     * @param {function(ctx)} onInit
     * @returns {function(...[*]=)}
     */
    createRoute: (onInit: (ctx: Context) => void) => (ctx: Context) => {
      const client = new Client({ ctx, emitter, pingInterval, onInit });
      ctx.body = client;
    },
  };
};

module.exports = createSSE; // @todo remove me
export default createSSE;
