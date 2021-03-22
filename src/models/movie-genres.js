module.exports = (sequelize, DataTypes) => {
  const MovieGenre = sequelize.define(
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
  return MovieGenre;
};
