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
      // todo
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

    // Movie.belongsToMany(models.Video, {
    //   through: {
    //     model: models.MovieVideo,
    //   },
    //   foreignKey: 'movie_id',
    //   otherKey: 'video_id',
    // });

    // Movie.hasMany(models.MovieCast, {
    //   foreignKey: 'movie_id',
    //   as: 'Cast',
    // });

    // Movie.hasMany(models.MovieCrew, {
    //   foreignKey: 'movie_id',
    //   as: 'Crew',
    // });

    // Movie.belongsToMany(models.Image, {
    //   through: {
    //     model: models.MovieBackdrop,
    //   },
    //   foreignKey: 'movie_id',
    //   otherKey: 'image_id',
    //   as: 'Backdrops',
    // });

    // Movie.belongsToMany(models.Image, {
    //   through: {
    //     model: models.MoviePoster,
    //   },
    //   foreignKey: 'movie_id',
    //   otherKey: 'image_id',
    //   as: 'Posters',
    // });

    // Movie.hasMany(models.Keyword, {
    //   through: {
    //     model: models.MovieKeyword,
    //   },
    //   foreignKey: 'movieId',
    //   otherKey: 'keywordId',
    // });

    Movie.hasMany(models.File, { foreignKey: 'movieId', as: 'files' });
  };

  return Movie;
};
