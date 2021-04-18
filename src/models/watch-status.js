module.exports = (sequelize, DataTypes) => {
  const WatchStatus = sequelize.define(
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
        allowNull: true,
      },
      seasonNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      episodeNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      movieId: {
        type: DataTypes.INTEGER,
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
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'WatchStatus',
      timestamps: true,
    },
  );

  WatchStatus.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const { User, File } = models;

    WatchStatus.belongsTo(User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });

    WatchStatus.belongsTo(File, {
      as: 'file',
      foreignKey: 'fileId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });
  };

  return WatchStatus;
};
