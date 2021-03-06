const User = require('./users');

const testUser = {
  id: 42,
  nickname: 'Jean',
  email: 'jean@jean.com',
  password: 'secret',
  roles: 0,
  uploadRatio: 1,
  diskSpace: 1,
  diskUsage: 1,
};

describe('User normalizer', () => {
  it('Normalize should remove email and password field', () => {
    const { email, password, ...expectedUser } = testUser;
    expect(User.normalize(testUser)).toEqual(expectedUser);
  });

  it('NormalizeShort should only retreive id and nickname', () => {
    expect(User.normalizeShort(testUser)).toEqual({
      id: testUser.id,
      nickname: testUser.nickname,
    });
  });

  it('NormalizeFull should remove password field only', () => {
    const { password, ...expectedUser } = testUser;
    expect(User.normalizeFull(testUser)).toEqual(expectedUser);
  });
});
