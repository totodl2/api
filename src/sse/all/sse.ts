import createSSE from '../sse';

export const { send, createRoute } = createSSE();

module.exports = { send, createRoute }; // @todo remove me
