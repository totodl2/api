import { Nullable } from '../models/types';

export type FileMessage = {
  id: string;
  torrentHash: string;
  name: string;
  basename: Nullable<string>;
  directory: Nullable<string>;
  extension: Nullable<string>;
  bytesCompleted: number;
  length: number;
  priority: number;
  position: number;
  wanted: boolean;
  createdAt: string;
  updatedAt: string;
};

export enum FileMessageTypes {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  DOWNLOADED = 'downloaded',
}

export type BaseFileMessage<T = FileMessage> = {
  date: string;
  data: T;
  type: FileMessageTypes;
  objectId: string;
  hostId: string;
};

export type UpdatedFileMessage = BaseFileMessage<{
  new: FileMessage;
  old: FileMessage;
  diff: Partial<FileMessage>;
}>;

export type CreatedFileMessage = BaseFileMessage<FileMessage>;
export type DownloadedFileMessage = BaseFileMessage<FileMessage>;
export type DeletedFileMessage = BaseFileMessage<FileMessage>;
