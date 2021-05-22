/* eslint-disable import/prefer-default-export */
import { Nullable } from '../models/types';

export type TrackersMessage = {
  announce: string | null;
  id: number;
  scrape: string | null;
  tier: number;
};

export type TorrentMessage = {
  hash: string;
  name: Nullable<string>;
  eta: Nullable<number>;
  status: number;
  error: Nullable<number>;
  errorString: Nullable<string>;
  downloadDir: Nullable<string>;
  isFinished: boolean;
  isStalled: boolean;
  desiredAvailable: Nullable<string | number>; // big int maybe treated as string
  leftUntilDone: Nullable<string | number>; // big int maybe treated as string
  sizeWhenDone: Nullable<string | number>; // big int maybe treated as string
  totalSize: Nullable<string | number>; // big int maybe treated as string
  magnetLink: Nullable<string>;
  uploadedEver: Nullable<string | number>; // big int maybe treated as string
  seedRatioLimit: Nullable<number>;
  seedRatioMode: number;
  uploadRatio: Nullable<number>;
  peersConnected: Nullable<number>;
  peersSendingToUs: Nullable<number>;
  peersGettingFromUs: Nullable<number>;
  rateDownload: Nullable<number>;
  rateUpload: Nullable<number>;
  activityDate: Nullable<number>;
  createdAt: string;
  updatedAt: string;
  trackers: TrackersMessage[];
  /**
   * /!\ do not use
   */
  files?: object;
};

export enum TorrentMessageTypes {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  DOWNLOADED = 'downloaded',
}

export type BaseTorrentMessage<T = TorrentMessage> = {
  date: string;
  data: T;
  type: TorrentMessageTypes;
  objectId: string;
  hostId: string;
};

export type UpdatedTorrentMessage = BaseTorrentMessage<{
  new: TorrentMessage;
  old: TorrentMessage;
  diff: Partial<TorrentMessage>;
}>;

export type CreatedTorrentMessage = BaseTorrentMessage<TorrentMessage>;
export type DownloadedTorrentMessage = BaseTorrentMessage<TorrentMessage>;
export type DeletedTorrentMessage = BaseTorrentMessage<TorrentMessage>;
