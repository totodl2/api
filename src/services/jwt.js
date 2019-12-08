const jwt = require('jsonwebtoken');

const EXPIRATION = process.env.JWT_EXPIRATION || '7200s';
const MAX_AGE = process.env.JWT_MAX_AGE || '7300s';
const ALGO = 'HS512';

module.exports = {
  create: ({ id, roles }) =>
    jwt.sign(
      {
        id,
        roles,
      },
      process.env.JWT_SECRET,
      { expiresIn: EXPIRATION, algorithm: ALGO },
    ),
  verify: (token, opt = {}) =>
    jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ALGO,
      maxAge: opt.ignoreExpiration ? undefined : MAX_AGE,
      ...opt,
    }),
};
