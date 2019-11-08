const UserService = require('./user');
const { db } = require('../models');

const testUser = {
  nickname: 'Jean',
  email: 'jean@jean.com',
  password: 'secret',
  roles: 0,
  uploadRatio: 1,
  diskSpace: 1,
  diskUsage: 1,
};

describe('UserService', () => {
  beforeAll(() => db.sync());
  afterAll(() => db.dropAllSchemas());

  it('Should create an user', () => UserService.create(testUser));

  it('Normalize should remove email and password field', () => {
    const { email, password, ...expectedUser } = testUser;
    expect(UserService.normalize(testUser)).toEqual(expectedUser);
  });

  it('Should not authenticate user with invalid email', async () => {
    expect(UserService.authenticate('notfound@doe.com', 'a')).rejects.toThrow();
  });

  it('Should not authenticate user with wrong password', async () => {
    expect(UserService.authenticate('jean@jean.com', 'a')).rejects.toThrow();
  });

  it.only('Should authenticate user', async () => {
    const userData = {
      nickname: 'John',
      email: 'john-deux@doe.com',
      password: 'test',
    };
    const user = await UserService.create(userData);
    expect(user.id).toBeDefined();

    await expect(
      UserService.authenticate(userData.email, userData.password),
    ).resolves.toHaveProperty('id', user.id);
  });
});
