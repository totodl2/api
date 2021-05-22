import debug from 'debug';

const createDebug = (name: string) => debug(`app${name ? `:${name}` : ''}`);

export default createDebug;
module.exports = createDebug; // @todo remove me
