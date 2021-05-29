import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import Jwt from './jwt';

import { RefreshToken } from '../models';

const createTokenName = () => {
  const id = uuidv4();
  const hash = crypto.createHash('sha256');
  hash.update(id);
  return hash.digest('hex');
};

const RefreshTokenService = {
  consume: async (refreshToken: string, oldJwt: string, ip: string) => {
    const token = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: 'User',
    });

    if (!token) {
      throw new Error('Token not found');
    }

    if (token.ip !== ip) {
      throw new Error("Refresh token's ip mistmatch");
    }

    const jwt = Jwt.verify(oldJwt, { ignoreExpiration: true });
    if (jwt.id !== token.userId) {
      throw new Error('Invalid old jwt');
    }

    token.lastUsedAt = new Date();
    await token.save();

    return Jwt.create(await token.getUser());
  },
  create: (userId: number, ip: string) =>
    RefreshToken.create({
      userId,
      token: createTokenName(),
      ip,
    }),
};

export default RefreshTokenService;
