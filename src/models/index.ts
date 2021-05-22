import { Sequelize, DataTypes, Dialect } from 'sequelize';
import createFileRepository, {
  associate as associateFileRepository,
} from './files';
import createGenreRepository, {
  associate as associateGenreRepository,
} from './genres';
import createHostRepository, {
  associate as associateHostRepository,
} from './hosts';
import createMovieGenreRepository from './movie-genres';
import createMovieRepository, {
  associate as associateMovieRepository,
} from './movies';
import createRefreshTokenRepository, {
  associate as associateRefreshToken,
} from './refresh-tokens';
import createTorrentRepository, {
  associate as associateTorrent,
} from './torrents';
import createTvRepository, { associate as associateTv } from './tv';
import createTvGenreRepository from './tv-genres';
import createUserRepository, { associate as associateUser } from './users';
import createWatchStatusRepository, {
  associate as associateWatchStatus,
} from './watch-status';

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

const repositories = {
  File: createFileRepository(db),
  Genre: createGenreRepository(db),
  Host: createHostRepository(db),
  MovieGenre: createMovieGenreRepository(db),
  Movie: createMovieRepository(db),
  RefreshToken: createRefreshTokenRepository(db),
  Torrent: createTorrentRepository(db),
  Tv: createTvRepository(db),
  TvGenre: createTvGenreRepository(db),
  User: createUserRepository(db),
  WatchStatus: createWatchStatusRepository(db),
};

export type RepositoriesTypes = typeof repositories;

associateFileRepository(repositories);
associateGenreRepository(repositories);
associateHostRepository(repositories);
associateMovieRepository(repositories);
associateRefreshToken(repositories);
associateTorrent(repositories);
associateTv(repositories);
associateUser(repositories);
associateWatchStatus(repositories);

const out = {
  ...repositories,
  db,
  sequelize: db,
  Sequelize,
};

module.exports = out;
