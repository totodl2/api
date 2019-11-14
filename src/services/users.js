const { User, Torrent, Sequelize } = require('../models');
const Roles = require('./roles');
const PasswordsService = require('./passwords');

module.exports = {
  /**
   * @param {string} password
   * @param {string} email
   * @param {Object} data
   * @returns {Promise<User>}
   */
  create: async ({ password, email, ...data }) =>
    User.create({
      ...data,
      email: email.toLowerCase(),
      roles: Roles.ROLE_LEECHER,
      password: await PasswordsService.hash(password),
    }),
  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
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
  /**
   * @param {Number} id
   * @returns {Promise<User|null>}
   */
  getById: async id => User.findOne({ where: { id } }),
  /**
   * @param {string} [password]
   * @param {string} [email]
   * @param {User} user
   * @returns {Object}
   */
  normalize: ({ password, email, ...user }) => user,
  /**
   * @param {User} user
   * @returns {Promise<User>}
   */
  updateSpaceUsage: async user => {
    const usage = await Torrent.sum('totalSize', {
      where: { userId: user.id, totalSize: { [Sequelize.Op.gte]: 0 } },
    });

    if (usage !== user.diskUsage) {
      user.set('diskUsage', usage || 0);
      await user.save();
    }

    return user;
  },
};
