import jwt, { VerifyOptions } from 'jsonwebtoken';

const EXPIRATION = process.env.JWT_EXPIRATION || '7200s';
const MAX_AGE = process.env.JWT_MAX_AGE || '7300s';
const ALGO = 'HS512';

if (!process.env.JWT_SECRET) {
  throw new Error('Undefined env variable JWT_SECRET');
}

export type JwtType = {
  id: number;
  roles: number;
};

const JwtService = {
  create: ({ id, roles }: JwtType) =>
    jwt.sign(
      {
        id,
        roles,
      },
      process.env.JWT_SECRET!,
      { expiresIn: EXPIRATION, algorithm: ALGO },
    ),
  verify: (
    token: string,
    opt: Omit<VerifyOptions, 'algorithm' | 'maxAge'> = {},
  ) =>
    jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: [ALGO],
      maxAge: opt.ignoreExpiration ? undefined : MAX_AGE,
      ...opt,
    }) as JwtType,
};

export default JwtService;
module.exports = JwtService; // @todo: remove me
