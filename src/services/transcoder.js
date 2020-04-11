const fs = require('fs');
const Url = require('url');
const querystring = require('querystring');

const createCdnLink = require('../utils/createCdnLink');
const createMuxerApi = require('../api/createMuxer');
const createTranscoderApi = require('../api/createTranscoder');
const Host = require('./hosts');
const Files = require('./files');

const { TRANSCODERS_CONF_PATH } = process.env;
const EXPIRATION_TIME = 5 * 360 * 24 * 60 * 60; // 5 years

const generateLongLivedCdnUrl = (file, host) =>
  createCdnLink(
    file.id,
    file.name,
    host.cdnUrl,
    host.cdnSecret,
    EXPIRATION_TIME,
  );

const generateUrl = (url, path, params = {}) => {
  const uri = Url.resolve(url, path);
  return `${uri}${uri.indexOf('?') !== -1 ? '&' : '?'}${querystring.stringify(
    params,
  )}`;
};

class Transcoder {
  /**
   *
   * @param {{extensions: string[],transcoders:{},muxer:{url:string,endPath:string,uploadPath:string,apiKey:string},notify:{url:string,apiKey:string,path:string}}|null} conf
   */
  constructor(conf = null) {
    this.enabled = !!conf;
    if (!conf) {
      return;
    }

    this.transcoders = Object.entries(conf.transcoders).map(
      ([name, transcoConf]) => {
        const api = createTranscoderApi(transcoConf.apiKey, transcoConf.url);
        api.name = name;
        return api;
      },
    );

    this.muxerApi = createMuxerApi(conf.muxer.apiKey, conf.muxer.url);
    this.muxer = conf.muxer;
    this.notify = conf.notify;
    this.compatibles = conf.extensions.map(ext => ext.toLowerCase());
  }

  /**
   * Check if transcoder is compatible with this extension
   * @param {{extension:string}} file
   * @return {boolean}
   */
  isCompatible(file) {
    return this.compatibles.indexOf(file.extension.toLowerCase()) !== -1;
  }

  /**
   * Check if the media is supported by all transcoders
   * @param {File} file
   * @return {Promise<boolean>}
   */
  async supports(file) {
    const host = await Host.getOne(file.hostId);
    const url = generateLongLivedCdnUrl(file, host);

    const responses = await Promise.all(
      this.transcoders.map(transco =>
        transco.support({ data: { media: url } }),
      ),
    );

    return responses.reduce((prev, resp) => prev && resp.data === true, true);
  }

  /**
   * Send file to transcoders
   * @param {File} file
   * @return {Promise<boolean>}
   */
  async transcode(file) {
    const host = await Host.getOne(file.hostId);
    const url = generateLongLivedCdnUrl(file, host);
    const subtitle = await Files.findSubtitle(file);
    const subtitleUrl = subtitle
      ? generateLongLivedCdnUrl(subtitle, host)
      : null;

    const transcodersList = this.transcoders.map(t => t.name).join(',');
    const responses = await Promise.all(
      this.transcoders.map(transco =>
        transco.transcode({
          data: {
            id: file.id,
            media: url,
            output: generateUrl(this.muxer.url, this.muxer.uploadPath, {
              'api-key': this.muxer.apiKey,
              id: file.id,
            }),
            end: generateUrl(this.muxer.url, this.muxer.endPath, {
              'api-key': this.muxer.apiKey,
              id: file.id,
              name: transco.name,
              waiting: transcodersList,
              notify: generateUrl(this.notify.url, this.notify.path, {
                'api-key': this.notify.apiKey,
                id: file.id,
              }),
              ...(subtitleUrl ? { subtitle: subtitleUrl } : {}),
            }),
          },
        }),
      ),
    );

    return responses.reduce((prev, resp) => prev && resp.data === true, true);
  }

  /**
   * Clean transcoding files
   * @param {string|number} id
   * @return {Promise<boolean>}
   */
  async clean(id) {
    const responses = await Promise.all([
      ...this.transcoders.map(transco =>
        transco.cancel({ routeParams: { id } }),
      ),
      this.muxerApi.delete({ routeParams: { id } }),
    ]);

    return responses.reduce((prev, resp) => prev && resp.data === true, true);
  }
}

module.exports = new Transcoder(
  TRANSCODERS_CONF_PATH
    ? JSON.parse(fs.readFileSync(TRANSCODERS_CONF_PATH, { encoding: 'UTF-8' }))
    : null,
);

module.exports.Transcoder = Transcoder;
