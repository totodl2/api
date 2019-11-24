module.exports = {
  /**
   * @param {string} [password]
   * @param {string} [email]
   * @param {User} user
   * @returns {Object}
   */
  normalize: ({ password, email, ...user }) => user,
  /**
   * Normalize essentials value for user
   * @returns {Object}
   */
  normalizeShort: ({ id, nickname }) => ({ id, nickname }),
};
