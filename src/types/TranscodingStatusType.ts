export type TranscodingStatusDataType = {
  progress: Number;
  job: string; // jobid
};

/**
 * Object key is the job name
 */
type TranscodingStatusType = {
  [key: string]: TranscodingStatusDataType;
};

export default TranscodingStatusType;
