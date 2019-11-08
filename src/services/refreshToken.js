const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const Jwt = require('./jwt');

const { RefreshToken } = require('../models');

const createTokenName = () => {
  const id = uuidv4();
  const hash = crypto.createHash('sha256');
  hash.update(id);
  return hash.digest('hex');
};

module.exports = {
  consume: async (refreshToken, oldJwt, ip) => {
    const token = await RefreshToken.findOne({
      where: { token: refreshToken },
      include: 'User',
    });

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
  create: (userId, ip) =>
    RefreshToken.create({
      userId,
      token: createTokenName(),
      ip,
    }),
};
