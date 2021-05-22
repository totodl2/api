import { Sequelize, DataTypes, Dialect } from 'sequelize';
import createFile from './files';
import createGenre from './genres';
import createHost from './hosts';
import createMovieGenre from './movie-genres';
import createMovie from './movies';
import createRefreshToken from './refresh-tokens';
import createTorrent from './torrents';
import createTv from './tv';
import createTvGenre from './tv-genres';
import createUser from './users';
import createWatchStatus from './watch-status';
import ModelStaticType from './modelStaticType';

const db = new Sequelize(
  process.env.DATABASE_NAME!,
  process.env.DATABASE_USER!,
  process.env.DATABASE_PASSWORD,
  {
    dialect: (process.env.DATABASE_DIALECT || 'postgres') as Dialect,
    logging: !!parseInt(process.env.DATABASE_LOGGING || '0', 10),
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    storage: process.env.DATABASE_STORAGE,
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    },
  },
);

const models = {
  File: createFile(db, DataTypes),
  Genre: createGenre(db),
  Host: createHost(db),
  MovieGenre: createMovieGenre(db, DataTypes),
  Movie: createMovie(db, DataTypes),
  RefreshToken: createRefreshToken(db, DataTypes),
  Torrent: createTorrent(db, DataTypes),
  Tv: createTv(db, DataTypes),
  TvGenre: createTvGenre(db, DataTypes),
  User: createUser(db, DataTypes),
  WatchStatus: createWatchStatus(db, DataTypes),
};

export type ModelsTypes = typeof models;

const out = {
  ...models,
  db,
  sequelize: db,
  Sequelize,
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = out;
