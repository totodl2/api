const { MeiliSearch } = require('meilisearch');

module.exports = new MeiliSearch({
  host: process.env.MEILI_URL,
  apiKey: process.env.MEILI_MASTER_KEY,
});
