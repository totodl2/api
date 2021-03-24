module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define(
    'Movie',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
      },
      adult: DataTypes.BOOLEAN,
      backdropPath: DataTypes.STRING,
      budget: DataTypes.BIGINT,
      homepage: DataTypes.STRING,
      imdbId: DataTypes.STRING,
      originalLanguage: DataTypes.STRING(8),
      originalTitle: DataTypes.STRING,
      overview: DataTypes.TEXT,
      popularity: DataTypes.FLOAT,
      posterPath: DataTypes.STRING,
      releaseDate: DataTypes.DATE,
      runtime: DataTypes.INTEGER,
      status: DataTypes.STRING,
      tagline: DataTypes.STRING,
      title: DataTypes.STRING,
      voteAverage: DataTypes.FLOAT,
      voteCount: DataTypes.INTEGER,
      productionCompanies: DataTypes.JSON,
      productionCountries: DataTypes.JSON,
      spokenLanguages: DataTypes.JSON,
      videos: DataTypes.JSON,
      credits: DataTypes.JSON,
      images: DataTypes.JSON,
      keywords: DataTypes.JSON,
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      timestamps: true,
      tableName: 'Movies',
      classMethods: {},
    },
  );

  Movie.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    Movie.belongsToMany(models.Genre, {
      through: {
        model: models.MovieGenre,
      },
      foreignKey: 'movieId',
      otherKey: 'genreId',
      as: 'genres',
    });

    Movie.hasMany(models.File, { foreignKey: 'movieId', as: 'files' });
  };

  return Movie;
};
