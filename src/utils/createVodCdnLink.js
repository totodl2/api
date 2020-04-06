const url = require('url');
const crypt = require('crypto');
const path = require('path');

const { LINKS_EXPIRATION, VOD_CDN_URL, VOD_CDN_SECRET } = process.env;
const DEFAULT_EXPIRATION = LINKS_EXPIRATION || 172800;

module.exports = {
  /**
   * Create download link from cdn
   * @param {string|number} id
   * @param {string} filename cdn filename
   * @param {string} basename base name for attachement
   * @param {number} expiration
   * @return {string}
   */
  download: (id, filename, basename, expiration = DEFAULT_EXPIRATION) => {
    const expires = (Date.now() + expiration).toString();

    const hash = crypt
      .createHash('md5')
      .update(expires + VOD_CDN_SECRET + id)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return url.resolve(
      VOD_CDN_URL,
      path.join(
        encodeURIComponent(hash),
        id,
        expires,
        encodeURIComponent(filename),
        encodeURIComponent(`${basename}-${filename}`),
      ),
    );
  },
};
