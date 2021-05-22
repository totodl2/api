import search from '../services/search';

const deleteIndex = async () => {
  await search.deleteIndex();
  process.exit(0);
};

module.exports = deleteIndex; // @todo remove me
export default deleteIndex;
