module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      'Tv',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        backdropPath: {
          type: DataTypes.STRING,
        },
        firstAirDate: {
          type: DataTypes.DATE,
        },
        lastAirDate: {
          type: DataTypes.DATE,
        },
        homepage: {
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
        },
        numberOfEpisodes: {
          type: DataTypes.INTEGER,
        },
        numberOfSeasons: {
          type: DataTypes.INTEGER,
        },
        originalLanguage: {
          type: DataTypes.STRING(8),
        },
        originalName: {
          type: DataTypes.STRING,
        },
        inProduction: { type: DataTypes.BOOLEAN },
        overview: {
          type: DataTypes.TEXT,
        },
        popularity: {
          type: DataTypes.FLOAT,
        },
        posterPath: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.STRING,
        },
        type: {
          type: DataTypes.STRING,
        },
        voteAverage: {
          type: DataTypes.FLOAT,
        },
        voteCount: {
          type: DataTypes.INTEGER,
        },
        externalIds: { type: DataTypes.JSON },
        episodeRunTime: { type: DataTypes.JSON },
        networks: { type: DataTypes.JSON },
        originCountry: { type: DataTypes.JSON },
        images: { type: DataTypes.JSON },
        credits: { type: DataTypes.JSON },
        keywords: { type: DataTypes.JSON },
        videos: { type: DataTypes.JSON },
        seasons: { type: DataTypes.JSON },
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
      'TvGenres',
      {
        tvId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Tv',
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

    await queryInterface.addColumn('Files', 'tvId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Tv',
        key: 'id',
      },
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('Files', 'seasonNumber', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('Files', 'episodeNumber', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });

    await queryInterface.addIndex('Files', ['tvId'], {
      name: 'Files_tvId_idx',
    });
    await queryInterface.addIndex('TvGenres', ['tvId'], {
      name: 'TvGenres_tvId_idx',
    });
    await queryInterface.addIndex('TvGenres', ['genreId'], {
      name: 'TvGenres_genreId_idx',
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('Tv');
    await queryInterface.dropTable('TvGenres');
    await queryInterface.removeIndex('Files', 'Files_tvId_idx');
    await queryInterface.dropColumn('Files', 'tvId');
    await queryInterface.dropColumn('Files', 'seasonNumber');
    await queryInterface.dropColumn('Files', 'episodeNumber');
  },
};
