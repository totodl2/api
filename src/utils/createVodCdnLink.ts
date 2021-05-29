import url from 'url';
import crypt from 'crypto';
import path from 'path';

const { LINKS_EXPIRATION, VOD_CDN_URL, VOD_CDN_SECRET } = process.env;
const DEFAULT_EXPIRATION = LINKS_EXPIRATION
  ? parseInt(LINKS_EXPIRATION, 10)
  : 172800;

const createVodCdnLink = {
  /**
   * Create download link from cdn
   */
  download: (
    id: string,
    filename: string,
    basename: string,
    expiration: number = DEFAULT_EXPIRATION,
  ) => {
    const expires = (Date.now() + expiration).toString();

    const hash = crypt
      .createHash('md5')
      .update(expires + VOD_CDN_SECRET + id)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return url.resolve(
      VOD_CDN_URL!,
      path.join(
        encodeURIComponent(hash),
        id,
        expires,
        encodeURIComponent(filename),
        encodeURIComponent(`${basename}-${filename}`),
      ),
    );
  },

  /**
   * Create playlist url
   */
  stream: (id: string, presets: string[], expiration = DEFAULT_EXPIRATION) => {
    const expires = (Date.now() + expiration).toString();

    const hash = crypt
      .createHash('md5')
      .update(expires + VOD_CDN_SECRET + id)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return url.resolve(
      VOD_CDN_URL!,
      path.join(
        'stream',
        encodeURIComponent(hash),
        id,
        expires,
        encodeURIComponent(presets.join(',')),
        'master.m3u8',
      ),
    );
  },
};

export default createVodCdnLink;
