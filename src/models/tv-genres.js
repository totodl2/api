module.exports = (sequelize, DataTypes) => {
  const TvGenre = sequelize.define(
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
  return TvGenre;
};
