const url = require('url');
const crypt = require('crypto');
const { join } = require('path');

const DEFAULT_EXPIRATION = 172800;

module.exports = (path, baseURL, secret) => {
  const expires = (
    Date.now() + (process.env.LINKS_EXPIRATION || DEFAULT_EXPIRATION)
  ).toString();

  const hash = crypt
    .createHash('md5')
    .update(expires + secret + path)
    .digest('base64');

  const newPath = path
    .split('/')
    .map(el => encodeURIComponent(el))
    .join('/');

  return url.resolve(baseURL, join(encodeURIComponent(hash), expires, newPath));
};