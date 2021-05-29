import { Op } from 'sequelize';
import { User, Torrent } from '../models';
import { Roles } from './roles';
import PasswordsService from './passwords';
import { CreateUserAttributes, UserInstance } from '../models/users';

const UserService = {
  /**
   * Create user
   * @param password
   * @param email
   * @param data
   */
  create: async ({ password, email, ...data }: CreateUserAttributes) =>
    User.create({
      ...data,
      email: email.toLowerCase(),
      roles: Roles.ROLE_LEECHER,
      password: await PasswordsService.hash(password),
    }),
  /**
   * Auth user
   * @param email
   * @param password
   */
  authenticate: async (email: string, password: string) => {
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
   * Get user by id
   * @param id
   */
  getById: async (id: number) => User.findOne({ where: { id } }),
  /**
   * Update user storage usage by counting sum of all his files size
   * @param user
   */
  updateSpaceUsage: async (user: UserInstance) => {
    const usage = await Torrent.sum('totalSize', {
      where: { userId: user.id, totalSize: { [Op.gte]: 0 } },
    });

    if (usage !== user.diskUsage) {
      user.set('diskUsage', usage || 0);
      await user.save();
    }

    return user;
  },
};

export default UserService;
