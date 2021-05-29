import path from 'path';
import createLink from '../../utils/createCdnLink';
import createVodCdnLink from '../../utils/createVodCdnLink';
import { FileAttributes } from '../../models/files';
import { HostAttributes } from '../../models/hosts';
import { TorrentAttributes } from '../../models/torrents';
import { TranscodedElementTypes } from '../../types/TranscodedElementType';

export type NormalizableFileType = FileAttributes & {
  host?: HostAttributes;
  torrent?: TorrentAttributes;
};

export type TranscodedMediaType = {
  preset: string;
  type: TranscodedElementTypes.MEDIA;
  url: string;
};

export type TranscodedSubType = {
  title: string;
  type: TranscodedElementTypes.SUBTITLES;
  url: string;
  lang?: string;
};

export type NormalizedFileType = Omit<FileAttributes, 'transcoded'> & {
  userId?: number;
  transcoded: (TranscodedMediaType | TranscodedSubType)[] | null;
  url: string;
  vodUrl: string | null;
};

const normalizeTranscoded = (file: FileAttributes) => {
  const { transcoded } = file;
  if (!transcoded) {
    return null;
  }

  const basename = path.basename(file.name, path.extname(file.name));
  return transcoded.map<TranscodedSubType | TranscodedMediaType>(
    ({ type, title: preset, lang, filename }) => {
      if (type === TranscodedElementTypes.MEDIA) {
        return {
          type,
          preset,
          url: createVodCdnLink.download(file.id, filename, basename),
          lang,
        };
      }

      return {
        type,
        title: preset,
        lang,
        url: createVodCdnLink.download(file.id, filename, basename),
      };
    },
  );
};

const createVodUrl = (file: FileAttributes) => {
  const { transcoded } = file;
  if (!transcoded) {
    return null;
  }

  const presets = transcoded
    .filter(el => el.type === 'media')
    .map(el => el.title);

  return createVodCdnLink.stream(file.id, presets);
};

export const createUrl = (file: FileAttributes, host: HostAttributes) =>
  createLink(file.id, file.name, host.cdnUrl || '', host.cdnSecret || '');

/**
 * Normalize file
 */
const normalizeOne = (
  { host: fileHost, torrent, ...file }: NormalizableFileType,
  host?: HostAttributes | null,
): FileAttributes | NormalizedFileType => {
  if (file.bytesCompleted === file.length) {
    const finalHost = fileHost || host;
    if (!finalHost) {
      throw new Error(`Cannot find host for ${file.id}`);
    }
    const output: NormalizedFileType = {
      ...file,
      transcoded: normalizeTranscoded(file),
      url: createUrl(file, finalHost),
      vodUrl: createVodUrl(file),
    };

    if (torrent && torrent.userId) {
      output.userId = torrent.userId;
    }

    return output;
  }
  return file;
};

/**
 * Normalize array of files
 * @param {Array<File>|File} files
 * @param {Host} [host]
 * @returns {Array<Object>}
 */
export const normalize = (
  files: NormalizableFileType | NormalizableFileType[],
  host?: HostAttributes | null,
) => {
  if (!Array.isArray(files)) {
    return normalizeOne(files as NormalizableFileType, host);
  }
  return files.map(file => normalizeOne(file, host));
};
