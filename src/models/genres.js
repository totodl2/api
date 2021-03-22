module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define(
    'Genre',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'Genres',
      timestamps: false,
      classMethods: {},
    },
  );

  Genre.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    // associations can be defined here
    Genre.belongsToMany(models.Movie, {
      through: {
        model: models.MovieGenre,
      },
      foreignKey: 'genreId',
      otherKey: 'movieId',
      as: 'movies',
    });

    // Genre.belongsToMany(models.Tv, {
    //   through: {
    //     model: models.TvGenre,
    //   },
    //   foreignKey: 'genre_id',
    //   otherKey: 'tv_id',
    //   as: 'Tv',
    // });
  };

  return Genre;
};
