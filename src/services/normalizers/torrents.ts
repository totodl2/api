import { normalizeShort as normalizeUser } from './users';
import { normalize as normalizeFiles } from './files';
import { TorrentAttributes } from '../../models/torrents';
import { HostAttributes } from '../../models/hosts';
import { FileAttributes } from '../../models/files';
import { UserAttributes } from '../../models/users';

type CompleteTorrentType = TorrentAttributes & {
  files?: FileAttributes[] | null;
  user?: UserAttributes | null;
};

const normalizeOne = (
  torrent: CompleteTorrentType,
  host: HostAttributes | null,
) => ({
  ...torrent,
  files: torrent.files ? normalizeFiles(torrent.files, host) : [],
  user: torrent.user ? normalizeUser(torrent.user) : null,
});

export const normalize = (
  torrents: CompleteTorrentType | CompleteTorrentType[],
  host: HostAttributes | null = null,
) => {
  if (!Array.isArray(torrents)) {
    return normalizeOne(torrents, host);
  }
  return torrents.map(torrent => normalizeOne(torrent, host));
};

const normalizeOneShort = ({
  files,
  user,
  ...torrent
}: CompleteTorrentType) => ({
  ...torrent,
  user: user ? normalizeUser(user) : null,
});

export const normalizeShort = (
  torrents: CompleteTorrentType | CompleteTorrentType[],
) => {
  if (!Array.isArray(torrents)) {
    return normalizeOneShort(torrents);
  }
  return torrents.map(torrent => normalizeOneShort(torrent));
};
