const fixtures = require('sequelize-fixtures');
const User = require('./users');
const { db, ...models } = require('../models');

const testUser = {
  nickname: 'Jean',
  email: 'jean@jean.com',
  password: 'secret',
  roles: 0,
  uploadRatio: 1,
  diskSpace: 1,
  diskUsage: 1,
};

describe('User', () => {
  beforeAll(async () => {
    await db.sync();
    await fixtures.loadFiles(
      ['fixtures/users.js', 'fixtures/hosts.js', 'fixtures/torrents.js'],
      models,
    );
  });

  afterAll(() => db.dropAllSchemas());

  it('Should create an user', () => User.create(testUser));

  it('Normalize should remove email and password field', () => {
    const { email, password, ...expectedUser } = testUser;
    expect(User.normalize(testUser)).toEqual(expectedUser);
  });

  it('Should not authenticate user with invalid email', async () => {
    expect(User.authenticate('notfound@doe.com', 'a')).rejects.toThrow();
  });

  it('Should not authenticate user with wrong password', async () => {
    expect(User.authenticate('jean@jean.com', 'a')).rejects.toThrow();
  });

  it('Should authenticate user', async () => {
    const userData = {
      nickname: 'John',
      email: 'john-deux@doe.com',
      password: 'test',
    };
    const user = await User.create(userData);
    expect(user.id).toBeDefined();

    await expect(
      User.authenticate(userData.email, userData.password),
    ).resolves.toHaveProperty('id', user.id);
  });

  it('Should update disk usage', async () => {
    const user = await User.getById(1);
    expect(user.diskUsage).toBe(0);
    await User.updateSpaceUsage(user);
    expect(user.diskUsage).toBe(150);
  });
});
