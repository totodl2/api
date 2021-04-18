module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      'WatchStatus',
      {
        id: {
          type: DataTypes.INTEGER,
          field: 'id',
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          field: 'userId',
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
          onUpdate: 'NO ACTION',
          onDelete: 'CASCADE',
        },
        fileId: {
          type: DataTypes.UUID,
          field: 'fileId',
          allowNull: true,
          references: {
            model: 'Files',
            key: 'id',
          },
          onUpdate: 'NO ACTION',
          onDelete: 'CASCADE',
        },
        tvId: {
          type: DataTypes.INTEGER,
          field: 'tvId',
          allowNull: true,
        },
        seasonNumber: {
          type: DataTypes.INTEGER,
          field: 'seasonNumber',
          allowNull: true,
        },
        episodeNumber: {
          type: DataTypes.INTEGER,
          field: 'episodeNumber',
          allowNull: true,
        },
        movieId: {
          type: DataTypes.INTEGER,
          field: 'movieId',
          allowNull: true,
        },
        position: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        length: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
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

    await queryInterface.addIndex('WatchStatus', ['userId', 'tvId'], {
      name: 'WatchStatus_userId_tvId_idx',
    });
    await queryInterface.addIndex('WatchStatus', ['userId'], {
      name: 'WatchStatus_userId_idx',
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('WatchStatus');
  },
};
