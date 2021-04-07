module.exports = (sequelize, DataTypes) => {
  const Tv = sequelize.define(
    'Tv',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
      },
      backdropPath: DataTypes.STRING,
      firstAirDate: DataTypes.DATE,
      lastAirDate: DataTypes.DATE,
      homepage: DataTypes.STRING,
      name: DataTypes.STRING,
      numberOfEpisodes: DataTypes.INTEGER,
      numberOfSeasons: DataTypes.INTEGER,
      originalLanguage: DataTypes.STRING,
      originalName: DataTypes.STRING,
      inProduction: DataTypes.BOOLEAN,
      overview: DataTypes.TEXT,
      popularity: DataTypes.FLOAT,
      posterPath: DataTypes.STRING,
      status: DataTypes.STRING,
      type: DataTypes.STRING,
      voteAverage: DataTypes.FLOAT,
      voteCount: DataTypes.INTEGER,
      externalIds: DataTypes.JSON,
      episodeRunTime: DataTypes.JSON,
      networks: DataTypes.JSON,
      originCountry: DataTypes.JSON,
      images: DataTypes.JSON,
      credits: DataTypes.JSON,
      keywords: DataTypes.JSON,
      videos: DataTypes.JSON,
      seasons: DataTypes.JSON,
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      timestamps: true,
      tableName: 'Tv',
      classMethods: {},
    },
  );

  // genres
  Tv.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    Tv.belongsToMany(models.Genre, {
      through: {
        model: models.TvGenre,
      },
      foreignKey: 'tvId',
      otherKey: 'genreId',
      as: 'genres',
    });

    Tv.hasMany(models.File, { foreignKey: 'tvId', as: 'files' });
  };

  return Tv;
};
