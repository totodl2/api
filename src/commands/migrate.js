const migrate = require('../migrate');

module.exports = async () => {
  await migrate();
  process.exit(0);
};
