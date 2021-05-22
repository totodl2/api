import { Sequelize, DataTypes } from 'sequelize';

const createTvGenreRepository = (sequelize: Sequelize) =>
  sequelize.define(
    'TvGenre',
    {
      tvId: DataTypes.INTEGER,
      genreId: DataTypes.INTEGER,
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'TvGenres',
      timestamps: false,
    },
  );

export default createTvGenreRepository;
