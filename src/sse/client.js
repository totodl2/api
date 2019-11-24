// eslint-disable-next-line no-unused-vars
const EventEmitter = require('events');
const stream = require('stream');

class Client extends stream.Transform {
  /**
   * @param ctx
   * @param emitter
   * @param options
   */
  constructor(ctx, emitter, pingInterval) {
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
    });

    this.onPing = this.onPing.bind(this);
    this.onEvent = this.onEvent.bind(this);
    this._destroy = this._destroy.bind(this);

    emitter.on('event', this.onEvent);
    ctx.socket.on('error', this._destroy);
    ctx.socket.on('close', this._destroy);

    if (pingInterval) {
      this.interval = setInterval(this.onPing, pingInterval);
    }

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
      this.ctx = null;
    }

    if (this.emitter) {
      this.emitter.off('event', this.onEvent);
      this.emitter = null;
    }

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  _transform(event, enc, cb) {
    this.push(`event: ${event.name}\n`);
    this.push(`data: ${JSON.stringify(event.data)}\n\n`);
    cb();
  }
}

module.exports = Client;
