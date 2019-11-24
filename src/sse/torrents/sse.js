const createSSE = require('../sse');

const { send, middleware } = createSSE();
module.exports = { send, middleware };
