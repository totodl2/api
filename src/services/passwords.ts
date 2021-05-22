import bcrypt from 'bcrypt';

const PasswordsService = {
  hash: async (password: string) => bcrypt.hash(password, 10),
  compare: async (password: string, hashedPassword: string) =>
    bcrypt.compare(password, hashedPassword),
};

module.exports = PasswordsService; // @todo: remove me
export default PasswordsService;
