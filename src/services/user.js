const { User } = require('../models');
const PasswordsService = require('./passwords');

module.exports = {
  create: async ({ password, ...data }) =>
    User.create({
      ...data,
      password: await PasswordsService.hash(password),
    }),
};
