const url = require('url');
const crypt = require('crypto');
const { join } = require('path');

const DEFAULT_EXPIRATION = process.env.LINKS_EXPIRATION || 172800;

module.exports = (
  id,
  path,
  baseURL,
  secret,
  expiration = DEFAULT_EXPIRATION,
) => {
  const expires = (Date.now() + expiration).toString();

  const hash = crypt
    .createHash('md5')
    .update(expires + secret + id)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const newPath = path
    .split('/')
    .map(el => encodeURIComponent(el))
    .join('/');

  return url.resolve(
    baseURL,
    join(encodeURIComponent(hash), id, expires, newPath),
  );
};
