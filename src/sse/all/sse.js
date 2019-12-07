const createSSE = require('../sse');

const { send, createRoute } = createSSE();
module.exports = { send, createRoute };
