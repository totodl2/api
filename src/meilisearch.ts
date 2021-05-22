import { MeiliSearch } from 'meilisearch';

export default new MeiliSearch({
  host: process.env.MEILI_URL!,
  apiKey: process.env.MEILI_MASTER_KEY,
});
