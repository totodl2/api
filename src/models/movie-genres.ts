import { Sequelize, DataTypes } from 'sequelize';

const createMovieGenresRepository = (sequelize: Sequelize) =>
  sequelize.define(
    'MovieGenre',
    {
      movieId: DataTypes.INTEGER,
      genreId: DataTypes.INTEGER,
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'MovieGenres',
      timestamps: false,
    },
  );

export default createMovieGenresRepository;
