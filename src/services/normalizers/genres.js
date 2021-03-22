/**
 * @param {number} id
 * @param {string} name
 * @return {{name:string, id:number}}
 */
const normalizeOne = ({ id, name }) => ({ id, name });

/**
 * @param {Array<Genre>|Genre}genre
 * @return {{name:string,id:number}}
 */
const normalize = genre => {
  if (Array.isArray(genre)) {
    return genre.map(g => normalizeOne(g));
  }
  return normalizeOne(genre);
};

module.exports = { normalize };
