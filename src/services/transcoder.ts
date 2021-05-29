import fs from 'fs';
import Url from 'url';
import querystring from 'querystring';

import createCdnLink from '../utils/createCdnLink';
import createMuxerApi, { MuxerApiType } from '../api/createMuxer';
import createTranscoderApi, {
  TranscoderApiType,
} from '../api/createTranscoder';
import Host from './hosts';
import Files from './files';
import { FileAttributes, FileInstance } from '../models/files';
import { HostAttributes } from '../models/hosts';

const { TRANSCODERS_CONF_PATH } = process.env;
const EXPIRATION_TIME = 5 * 360 * 24 * 60 * 60; // 5 years

const generateLongLivedCdnUrl = (
  file: Pick<FileAttributes, 'id' | 'name'>,
  host: Pick<HostAttributes, 'cdnUrl' | 'cdnSecret'>,
) =>
  createCdnLink(
    file.id,
    file.name,
    host.cdnUrl!,
    host.cdnSecret!,
    EXPIRATION_TIME,
  );

const generateUrl = (url: string, path: string, params = {}) => {
  const uri = Url.resolve(url, path);
  return `${uri}${uri.indexOf('?') !== -1 ? '&' : '?'}${querystring.stringify(
    params,
  )}`;
};

type NotifyConfigurationType = {
  url: string;
  apiKey: string;
  path: string;
};

type TranscoderConfigurationType = {
  url: string;
  apiKey: string;
};

type MuxerConfigurationType = {
  url: string;
  endPath: string;
  uploadPath: string;
  apiKey: string;
};

type ConfigurationType = {
  extensions: string[];
  transcoders: { [key: string]: TranscoderConfigurationType };
  muxer: MuxerConfigurationType;
  notify: NotifyConfigurationType;
  progress: NotifyConfigurationType;
};

type TranscodersApi = TranscoderApiType & {
  name: string;
};

export class Transcoder {
  public enabled: boolean;

  private transcoders: TranscodersApi[] | undefined;

  private muxer: MuxerConfigurationType | undefined;

  private notify: NotifyConfigurationType | undefined;

  private progress: NotifyConfigurationType | undefined;

  public compatibles: string[] | undefined;

  private muxerApi: MuxerApiType | undefined;

  constructor(conf?: ConfigurationType) {
    this.enabled = !!conf;
    if (!conf) {
      return;
    }

    this.transcoders = Object.entries(conf.transcoders).map(
      ([name, transcoConf]) => ({
        ...createTranscoderApi(transcoConf.apiKey, transcoConf.url),
        name,
      }),
    );

    this.muxerApi = createMuxerApi(conf.muxer.apiKey, conf.muxer.url);

    this.muxer = conf.muxer;
    this.notify = conf.notify;
    this.progress = conf.progress;
    this.compatibles = conf.extensions.map(ext => ext.toLowerCase());
  }

  /**
   * Check if transcoder is compatible with this extension
   * @param file
   * @return {boolean}
   */
  isCompatible(file: Pick<FileAttributes, 'extension'>) {
    return (
      this.compatibles!.indexOf((file.extension || '').toLowerCase()) !== -1
    );
  }

  /**
   * Check if the media is supported by all transcoders
   * @param {File} file
   * @return {Promise<boolean>}
   */
  async supports(
    file: Pick<FileAttributes, 'hostId'> &
      Parameters<typeof generateLongLivedCdnUrl>[0],
  ) {
    const host = await Host.getOne(file.hostId);
    const url = generateLongLivedCdnUrl(file, host!);

    const responses = await Promise.all(
      this.transcoders!.map(transco =>
        transco.support<boolean | null>({ data: { media: url } }),
      ),
    );

    return responses.reduce<boolean>(
      (prev, resp) => prev && resp.data === true,
      true,
    );
  }

  /**
   * Send file to transcoders
   * @param {File} file
   * @return {Promise<boolean>}
   */
  async transcode(file: FileInstance): Promise<boolean> {
    if (!this.isCompatible(file)) {
      return false;
    }

    const supported = await this.supports(file);
    if (!supported) {
      return false;
    }

    const host = (await Host.getOne(file.hostId))!;
    const url = generateLongLivedCdnUrl(file, host);
    const subtitle = await Files.findSubtitle(file);
    const subtitleUrl = subtitle
      ? generateLongLivedCdnUrl(subtitle, host)
      : null;

    await file.update({
      transcodingQueuedAt: new Date(),
      transcodedAt: null,
      transcodingStatus: null,
      transcodingFailedAt: null,
    });

    const transcodersList = this.transcoders!.map(t => t.name).join(',');
    const responses = await Promise.all(
      this.transcoders!.map(transco =>
        transco.transcode<boolean | null>({
          data: {
            id: file.id,
            media: url,
            output: generateUrl(this.muxer!.url, this.muxer!.uploadPath, {
              'api-key': this.muxer!.apiKey,
              id: file.id,
            }),
            progress: generateUrl(this.progress!.url, this.progress!.path, {
              'api-key': this.progress!.apiKey,
              id: file.id,
              name: transco.name,
            }),
            end: generateUrl(this.muxer!.url, this.muxer!.endPath, {
              'api-key': this.muxer!.apiKey,
              id: file.id,
              name: transco.name,
              waiting: transcodersList,
              notify: generateUrl(this.notify!.url, this.notify!.path, {
                'api-key': this.notify!.apiKey,
                id: file.id,
              }),
              ...(subtitleUrl ? { subtitle: subtitleUrl } : {}),
            }),
          },
        }),
      ),
    );

    return responses.reduce<boolean>(
      (prev, resp) => prev && resp.data === true,
      true,
    );
  }

  /**
   * Clean transcoding files
   */
  async clean(id: string | number): Promise<boolean> {
    const responses = await Promise.all([
      ...this.transcoders!.map(transco =>
        transco.cancel<boolean | null>({ routeParams: { id } }),
      ),
      this.muxerApi!.delete<boolean | null>({ routeParams: { id } }),
    ]);

    return responses.reduce<boolean>(
      (prev, resp) => prev && resp.data === true,
      true,
    );
  }
}

const TranscoderServiceInstance = new Transcoder(
  TRANSCODERS_CONF_PATH
    ? JSON.parse(fs.readFileSync(TRANSCODERS_CONF_PATH, { encoding: 'utf-8' }))
    : null,
);

export default TranscoderServiceInstance;
