const Umzug = require('umzug');
const path = require('path');
const models = require('./models/index.js');
const debug = require('./debug')('migrations');

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: models.sequelize,
  },
  migrations: {
    params: [models.sequelize.getQueryInterface(), models.Sequelize],
    path: path.join(__dirname, './migrations'),
  },
});

module.exports = () =>
  umzug.up().then(migrations => {
    if (migrations.length <= 0) {
      debug('Your db is up to date');
    } else {
      migrations.forEach(migration => {
        debug('Migration %s done.', migration.file);
      });
    }
    return migrations;
  });
