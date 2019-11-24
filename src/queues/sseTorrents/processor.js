const { send } = require('../../sse/torrents/sse');

module.exports = async job => {
  send(job.name, job.data);
};
