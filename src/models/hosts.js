/* eslint new-cap: "off", global-require: "off", no-unused-vars: "off" */

module.exports = (sequelize, DataTypes) => {
  const Host = sequelize.define(
    'Host',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        field: 'name',
        allowNull: false,
      },
    },
    {
      schema: 'public',
      tableName: 'Hosts',
      timestamps: false,
    },
  );

  Host.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const { Torrent } = models;
    const { User } = models;

    Host.hasMany(Torrent, {
      as: 'TorrentsHostidFkeys',
      foreignKey: 'hostId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });

    Host.belongsToMany(User, {
      as: 'TorrentUsers',
      through: Torrent,
      foreignKey: 'hostId',
      otherKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });
  };

  return Host;
};
