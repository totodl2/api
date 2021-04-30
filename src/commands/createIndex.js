const search = require('../services/search');

module.exports = async () => {
  await search.createIndex();
  process.exit(0);
};
