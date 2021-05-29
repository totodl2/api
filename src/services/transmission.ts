import fs from 'fs';
import FormData from 'form-data';
import Torrents from './torrents';
import api, { TransmissionApiResult } from '../api/createTransmission';
import { HostAttributes } from '../models/hosts';
import { Defined } from '../types/TypesHelper';

type TransmissionUploadResult = TransmissionApiResult<{
  hashString: string;
  name: string;
}>;

type TransmissionActionResult = TransmissionApiResult<boolean>;

const TransmissionService = {
  uploadFile: async (
    filePath: string,
    host: Defined<Pick<HostAttributes, 'transmissionServiceUrl' | 'id'>>,
    userId: number,
  ) => {
    const form = new FormData();
    form.append('torrent', fs.readFileSync(filePath), 'file.torrent');

    const {
      data: {
        data: { hashString: hash, name },
      },
    } = await api.upload.file<TransmissionUploadResult>({
      headers: form.getHeaders(),
      baseURL: host.transmissionServiceUrl,
      data: form.getBuffer(),
    });

    return Torrents.upsert({
      userId,
      name,
      hostId: host.id,
      hash,
    });
  },
  uploadMagnet: async (
    magnet: string,
    host: Defined<Pick<HostAttributes, 'transmissionServiceUrl' | 'id'>>,
    userId: number,
  ) => {
    const {
      data: {
        data: { hashString: hash, name },
      },
    } = await api.upload.magnet<TransmissionUploadResult>({
      baseURL: host.transmissionServiceUrl,
      data: { url: magnet },
    });

    return Torrents.upsert(
      {
        userId,
        name,
        hostId: host.id,
        hash,
      },
      true,
    );
  },
  setRatio: async (
    hash: string,
    ratio: number,
    host: Defined<Pick<HostAttributes, 'transmissionServiceUrl'>>,
  ) =>
    api.torrent.ratio<TransmissionActionResult>({
      baseURL: host.transmissionServiceUrl,
      routeParams: { hash, ratio },
    }),
  pause: async (
    hash: string,
    host: Defined<Pick<HostAttributes, 'transmissionServiceUrl'>>,
  ) =>
    api.torrent.pause<TransmissionActionResult>({
      baseURL: host.transmissionServiceUrl,
      routeParams: { hash },
    }),
  start: async (
    hash: string,
    host: Defined<Pick<HostAttributes, 'transmissionServiceUrl'>>,
  ) =>
    api.torrent.start<TransmissionActionResult>({
      baseURL: host.transmissionServiceUrl,
      routeParams: { hash },
    }),
  remove: async (
    hash: string,
    host: Defined<Pick<HostAttributes, 'transmissionServiceUrl'>>,
  ) =>
    api.torrent.remove<TransmissionActionResult>({
      baseURL: host.transmissionServiceUrl,
      routeParams: {
        hash,
      },
    }),
};

export default TransmissionService;
