const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(module.filename);
const out = {};

const db = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: process.env.DATABASE_DIALECT || 'postgres',
    logging: !!parseInt(process.env.DATABASE_LOGGING || 0, 10),
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 5432,
    storage: process.env.DATABASE_STORAGE,
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  },
);

fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js',
  )
  .forEach(file => {
    const model = db.import(path.join(__dirname, file));
    out[model.name] = model;
  });

Object.keys(out).forEach(modelName => {
  if (out[modelName].associate) {
    out[modelName].associate(out);
  }
});

out.db = db;
out.sequelize = db;
out.Sequelize = Sequelize;
module.exports = out;
