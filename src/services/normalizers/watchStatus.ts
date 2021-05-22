import { WatchStatusAttributes } from '../../models/watch-status';

export type NormalizedWatchStatus = Omit<
  WatchStatusAttributes,
  'userId' | 'fileId' | 'createdAt' | 'updatedAt'
>;

/**
 * Normalize array of watchStatus
 */
export const normalize = ({
  userId,
  fileId,
  ...status
}: WatchStatusAttributes): NormalizedWatchStatus => status;

module.exports = { normalize }; // @todo remove me
export default { normalize };
