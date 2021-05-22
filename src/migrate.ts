import Umzug from 'umzug';
import path from 'path';
import models from './models/index';
import debugFactory from './debug';

const debug = debugFactory('migrations');

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

export default () =>
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
