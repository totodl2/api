const search = require('../services/search');

module.exports = async () => {
  await search.deleteIndex();
  process.exit(0);
};
