const bcrypt = require('bcrypt');

module.exports = {
  hash: async password => bcrypt.hash(password, 10),
  compare: async (password, hashedPassword) =>
    bcrypt.compare(password, hashedPassword),
};
