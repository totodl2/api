const { User } = require('../models');
const Roles = require('./roles');
const PasswordsService = require('./passwords');

module.exports = {
  create: async ({ password, email, ...data }) =>
    User.create({
      ...data,
      email: email.toLowerCase(),
      roles: Roles.ROLE_USER,
      password: await PasswordsService.hash(password),
    }),
  authenticate: async (email, password) => {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (user === null) {
      throw new Error('User not found');
    }
    if (!(await PasswordsService.compare(password, user.password))) {
      throw new Error('Wrong password');
    }
    return user;
  },
  getById: async id => User.findOne({ where: { id } }),
  normalize: ({ password, email, ...user }) => user,
};
