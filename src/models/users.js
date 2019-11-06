/* eslint new-cap: "off", global-require: "off", no-unused-vars: "off" */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nickname: {
        type: DataTypes.STRING(32),
        field: 'nickname',
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(64),
        field: 'email',
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        field: 'password',
        allowNull: false,
      },
      roles: {
        type: DataTypes.INTEGER,
        field: 'roles',
        allowNull: false,
        defaultValue: 0,
      },
      uploadRatio: {
        type: DataTypes.INTEGER,
        field: 'uploadRatio',
        allowNull: false,
        defaultValue: 1,
      },
      diskSpace: {
        type: DataTypes.BIGINT,
        field: 'diskSpace',
        allowNull: false,
      },
      diskUsage: {
        type: DataTypes.BIGINT,
        field: 'diskUsage',
        allowNull: false,
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
      schema: 'public',
      tableName: 'Users',
      timestamps: true,
    },
  );

  User.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const { RefreshToken } = models;
    const { Torrent } = models;
    const { UploadingTorrent } = models;
    const { Host } = models;

    User.hasMany(RefreshToken, {
      as: 'RefreshTokensUseridFkeys',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });

    User.hasMany(Torrent, {
      as: 'TorrentsUseridFkeys',
      foreignKey: 'userId',
      onDelete: 'SET NULL',
      onUpdate: 'NO ACTION',
    });

    User.hasMany(UploadingTorrent, {
      as: 'UploadingTorrentsUseridFkeys',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });

    User.belongsToMany(Host, {
      as: 'TorrentHosts',
      through: Torrent,
      foreignKey: 'userId',
      otherKey: 'hostId',
      onDelete: 'SET NULL',
      onUpdate: 'NO ACTION',
    });
  };

  return User;
};
