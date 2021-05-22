import { Job } from 'bull';

import { send } from '../../sse/all/sse';

const processSseQueue = async (job: Job) => {
  send(job.name, job.data);
};

module.exports = processSseQueue; // @todo remove me
export default processSseQueue;
