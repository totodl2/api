import search from '../services/search';

const createIndex = async () => {
  await search.createIndex();
  process.exit(0);
};

module.exports = createIndex; // @todo remove me
export default createIndex;
