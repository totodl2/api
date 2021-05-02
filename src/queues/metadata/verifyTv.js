const Tv = require('../../services/tv');
const Search = require('../../services/search');

module.exports = async tvId => {
  const tv = await Tv.get(tvId, 'files');
  if (tv.files.length > 0) {
    return `Tv ${tv.name} has ${tv.files.length} files attached`;
  }

  await tv.destroy();
  await Search.deleteTvShow(tvId);

  return `Tv ${tv.name} (${tvId}, ${tv.id}) removed `;
};
