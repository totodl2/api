import migrateAction from '../migrate';

const migrate = async () => {
  await migrateAction();
  process.exit(0);
};

export default migrate;
