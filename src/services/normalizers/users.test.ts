import { normalize, normalizeShort, normalizeFull } from './users';
import { UserAttributes } from '../../models/users';

const testUser = {
  id: 42,
  nickname: 'Jean',
  email: 'jean@jean.com',
  password: 'secret',
  roles: 0,
  uploadRatio: 1,
  diskSpace: 1,
  diskUsage: 1,
} as UserAttributes;

describe('User normalizer', () => {
  it('Normalize should remove email and password field', () => {
    const { email, password, ...expectedUser } = testUser;
    expect(normalize(testUser)).toEqual(expectedUser);
  });

  it('NormalizeShort should only retreive id and nickname', () => {
    expect(normalizeShort(testUser)).toEqual({
      id: testUser.id,
      nickname: testUser.nickname,
    });
  });

  it('NormalizeFull should remove password field only', () => {
    const { password, ...expectedUser } = testUser;
    expect(normalizeFull(testUser)).toEqual(expectedUser);
  });
});
