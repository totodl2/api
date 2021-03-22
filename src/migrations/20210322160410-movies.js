module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      'Movies',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        adult: {
          type: DataTypes.BOOLEAN,
        },
        backdropPath: {
          type: DataTypes.STRING,
        },
        budget: {
          type: DataTypes.BIGINT,
        },
        homepage: {
          type: DataTypes.STRING,
        },
        imdbId: {
          type: DataTypes.STRING,
        },
        originalLanguage: {
          type: DataTypes.STRING(8),
        },
        originalTitle: {
          type: DataTypes.STRING,
        },
        overview: {
          type: DataTypes.TEXT,
        },
        popularity: {
          type: DataTypes.FLOAT,
        },
        posterPath: {
          type: DataTypes.STRING,
        },
        releaseDate: {
          type: DataTypes.DATE,
        },
        runtime: {
          type: DataTypes.INTEGER,
        },
        status: {
          type: DataTypes.STRING,
        },
        tagline: {
          type: DataTypes.STRING,
        },
        title: {
          type: DataTypes.STRING,
        },
        voteAverage: {
          type: DataTypes.FLOAT,
        },
        voteCount: {
          type: DataTypes.INTEGER,
        },
        productionCompanies: { type: DataTypes.JSON },
        productionCountries: { type: DataTypes.JSON },
        spokenLanguages: { type: DataTypes.JSON },
        videos: { type: DataTypes.JSON },
        credits: { type: DataTypes.JSON },
        images: { type: DataTypes.JSON },
        keywords: { type: DataTypes.JSON },
        createdAt: {
          type: DataTypes.DATE,
          field: 'createdAt',
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: 'updatedAt',
          allowNull: false,
        },
      },
      {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );

    await queryInterface.createTable(
      'Genres',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        name: {
          type: DataTypes.STRING,
          unique: true,
        },
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
      },
    );

    await queryInterface.createTable(
      'MovieGenres',
      {
        movieId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Movies',
            key: 'id',
          },
          onDelete: 'cascade',
        },
        genreId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Genres',
            key: 'id',
          },
          onDelete: 'cascade',
        },
      },
      {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
      },
    );

    await queryInterface.addColumn('Files', 'movieId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Movies',
        key: 'id',
      },
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('Genres', ['name'], {
      name: 'Genres_name_idx',
    });
    await queryInterface.addIndex('Files', ['movieId'], {
      name: 'Files_movieId_idx',
    });
    await queryInterface.addIndex('MovieGenres', ['movieId'], {
      name: 'MovieGenres_movieId_idx',
    });
    await queryInterface.addIndex('MovieGenres', ['genreId'], {
      name: 'MovieGenres_genreId_idx',
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('Movies');
    await queryInterface.dropTable('Genres');
    await queryInterface.dropTable('MovieGenres');
    await queryInterface.removeIndex('Files', 'Files_movieId_idx');
    await queryInterface.dropColumn('Files', 'movieId');
  },
};
