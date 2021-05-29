import search from '../services/search';

const deleteIndex = async () => {
  await search.deleteIndex();
  process.exit(0);
};

export default deleteIndex;
