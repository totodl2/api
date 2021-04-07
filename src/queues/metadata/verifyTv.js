const Tv = require('../../services/tv');

module.exports = async tvId => {
  const tv = await Tv.get(tvId, 'files');
  if (tv.files.length > 0) {
    return `Movie ${tv.name} has ${tv.files.length} files attached`;
  }

  await tv.destroy();
  return `Movie ${tv.name} removed`;
};
