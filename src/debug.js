const debug = require('debug');

module.exports = name => debug(`app${name ? `:${name}` : ''}`);
