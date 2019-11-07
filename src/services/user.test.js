const UserService = require('./user');
const { db } = require('../models');

describe('UserService', () => {
  beforeAll(() => db.sync());
  afterAll(() => db.dropAllSchemas());

  it('Should create an user', () =>
    UserService.create({
      nickname: 'Jean',
      email: 'jean@jean.com',
      password: 'secret',
      roles: 0,
      uploadRatio: 1,
      diskSpace: 1,
      diskUsage: 1,
    }));
});
