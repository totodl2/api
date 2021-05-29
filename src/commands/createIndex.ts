import search from '../services/search';

const createIndex = async () => {
  await search.createIndex();
  process.exit(0);
};

export default createIndex;
