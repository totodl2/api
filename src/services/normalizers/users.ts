import { UserAttributes } from '../../models/users';

export const normalize = ({ password, email, ...user }: UserAttributes) => user;

/**
 * Normalize essentials value for user
 */
export const normalizeShort = ({ id, nickname }: UserAttributes) => ({
  id,
  nickname,
});

export const normalizeFull = ({ password, ...user }: UserAttributes) => user;

const usersNormalizers = {
  normalize,
  normalizeShort,
  normalizeFull,
};

module.exports = usersNormalizers; // @todo remove me
export default usersNormalizers;
