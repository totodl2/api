import url from 'url';
import crypt from 'crypto';
import { join } from 'path';

const DEFAULT_EXPIRATION = process.env.LINKS_EXPIRATION
  ? parseInt(process.env.LINKS_EXPIRATION, 10)
  : 172800;

const createCdnLink = (
  id: string,
  path: string,
  baseURL: string,
  secret: string,
  expiration: number = DEFAULT_EXPIRATION,
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

export default createCdnLink;
