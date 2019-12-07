// eslint-disable-next-line no-unused-vars
const EventEmitter = require('eventemitter2').EventEmitter2;
const stream = require('stream');

const defaultOnInit = async ctx => {
  ctx.subscribe('event');
};

class Client extends stream.Transform {
  /**
   * @param {Object} parameters
   * @param {Object} parameters.ctx
   * @param {EventEmitter} parameters.emitter
   * @param {Function} [parameters.onInit]
   * @param {Number} parameters.pingInterval
   */

  constructor({ ctx, emitter, onInit, pingInterval }) {
    super({ writableObjectMode: true });
    this.ctx = ctx;
    this.emitter = emitter;
    ctx.req.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);
    ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    this.onPing = this.onPing.bind(this);
    this.onEvent = this.onEvent.bind(this);
    this.write = this.write.bind(this);
    this._destroy = this._destroy.bind(this);

    ctx.socket.on('error', this._destroy);
    ctx.socket.on('close', this._destroy);

    if (pingInterval) {
      this.interval = setInterval(this.onPing, pingInterval);
    }

    this.eventsSubscribed = [];
    this.ctx.subscribe = eventName => {
      this.eventsSubscribed.push(eventName);
      emitter.on(eventName, this.onEvent);
    };

    (onInit || defaultOnInit)(ctx);

    this.onPing();
  }

  onPing() {
    this.write({ name: 'ping', data: '🍆' });
  }

  onEvent(name, data) {
    this.write({ name, data });
  }

  _destroy() {
    if (this.ctx) {
      this.ctx.socket.off('error', this._destroy);
      this.ctx.socket.off('close', this._destroy);
      this.ctx.subscribe = null;
      this.ctx = null;
    }

    if (this.emitter) {
      this.eventsSubscribed.forEach(eventName => {
        this.emitter.off(eventName, this.onEvent);
      });
      this.emitter = null;
    }

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.onMessage) {
      this.onMessage = null;
    }
  }

  _transform(event, enc, cb) {
    this.push(`event: ${event.name}\n`);
    this.push(`data: ${JSON.stringify(event.data)}\n\n`);
    cb();
  }
}

module.exports = Client;
