/**
 * Normalize array of watchStatus
 * @param {WatchStatus} watchStatus
 * @returns {Array<Object>}
 */
const normalize = ({ userId, fileId, createdAt, updatedAt, ...status }) =>
  status;

module.exports = { normalize };
