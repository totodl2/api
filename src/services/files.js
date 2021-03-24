const path = require('path');
const { File } = require('../models');

const SUB_EXTENSIONS = ['ssa', 'ass', 'srt'];

module.exports = {
  /**
   * Get one file by his hash
   * @param {string} id uuidv4
   * @param {string|Array<string>} [include]
   * @returns {Promise<File|null>}
   */
  get: (id, include) => File.findOne({ where: { id }, include }),
  /**
   * Upsert file
   * @param {Object} data
   * @returns {Promise<File>}
   */
  upsert: async function create(data) {
    const [file, isNewRecord] = await File.findOrCreate({
      where: { id: data.id },
      defaults: data,
    });

    if (!isNewRecord) {
      await file.update(data);
    }

    return file;
  },

  /**
   * Search matching subtitle for file @file
   * @param {Model|File} file
   * @return {Promise<File | null>}
   */
  findSubtitle: file => {
    const basename = path.basename(file.basename, path.extname(file.basename));
    const filenames = SUB_EXTENSIONS.map(
      extension => `${basename}.${extension}`,
    );

    return File.findOne({
      where: {
        directory: file.directory,
        torrentHash: file.torrentHash,
        basename: filenames,
      },
    });
  },

  /**
   * @param {File} file
   * @param {Movie} movie
   * @return {Promise<void>}
   */
  setMovie: async (file, movie) => {
    await file.setMovie(movie);
  },
};
