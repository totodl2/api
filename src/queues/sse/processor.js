const { send } = require('../../sse/all/sse');

module.exports = async job => {
  send(job.name, job.data);
};
