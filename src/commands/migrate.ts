import migrateAction from '../migrate';

const migrate = async () => {
  await migrateAction();
  process.exit(0);
};

module.exports = migrate; // @todo remove me
export default migrate;
