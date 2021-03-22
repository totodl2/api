const path = require('path');
const createLink = require('../../utils/createCdnLink');
const createVodCdnLink = require('../../utils/createVodCdnLink');

const normalizeTranscoded = file => {
  const { transcoded } = file;
  if (!transcoded) {
    return null;
  }

  const basename = path.basename(file.name, path.extname(file.name));
  return transcoded.map(({ type, title: preset, lang, filename }) => {
    if (type === 'media') {
      return {
        type,
        preset,
        url: createVodCdnLink.download(file.id, filename, basename),
      };
    }
    return {
      type,
      title: preset,
      lang,
      url: createVodCdnLink.download(file.id, filename, basename),
    };
  });
};

const createVodUrl = file => {
  const { transcoded } = file;
  if (!transcoded) {
    return null;
  }

  const presets = transcoded
    .filter(el => el.type === 'media')
    .map(el => el.title);

  return createVodCdnLink.stream(file.id, presets);
};

/**
 * Normalize file
 * @param {File} files
 * @param {Host} host
 * @returns {Object}
 */
const normalizeOne = (file, host) => {
  if (file.bytesCompleted === file.length) {
    return {
      ...file,
      transcoded: normalizeTranscoded(file),
      url: createLink(
        file.id,
        file.name,
        host.cdnUrl || '',
        host.cdnSecret || '',
      ),
      vodUrl: createVodUrl(file),
    };
  }
  return file;
};
/**
 * Normalize array of files
 * @param {Array<File>|File} files
 * @param {Host} host
 * @returns {Array<Object>}
 */
const normalize = (files, host) => {
  if (!Array.isArray(files)) {
    return normalizeOne(files, host);
  }
  return files.map(file => normalizeOne(file, host));
};

const getBrief = ({ id, basename, name, torrentHash }) => ({
  id,
  basename,
  name,
  torrentHash,
});

const normalizeBrief = files => {
  if (Array.isArray(files)) {
    return files.map(file => getBrief(file));
  }
  return getBrief(files);
};

module.exports = { normalize, normalizeBrief };
