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
        allowNull: true,
      },
      transmissionServiceUrl: {
        type: DataTypes.STRING(255),
        field: 'transmissionServiceUrl',
        allowNull: true,
      },
      cdnUrl: {
        type: DataTypes.STRING(255),
        field: 'cdnUrl',
        allowNull: true,
      },
      cdnSecret: {
        type: DataTypes.STRING(255),
        field: 'cdnSecret',
        allowNull: true,
      },
      spaceAvailable: {
        type: DataTypes.BIGINT,
        field: 'spaceAvailable',
        allowNull: false,
        defaultValue: 0,
      },
      spaceReserved: {
        type: DataTypes.BIGINT,
        field: 'spaceReserved',
        allowNull: false,
        defaultValue: 0,
      },
      unavailabilityDetectedAt: {
        type: DataTypes.DATE,
        field: 'unavailabilityDetectedAt',
        allowNull: true,
      },
      lastUploadAt: {
        type: DataTypes.DATE,
        field: 'lastUploadAt',
        allowNull: true,
      },
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'Hosts',
      timestamps: false,
    },
  );

  Host.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const { Torrent } = models;
    const { File } = models;

    Host.hasMany(Torrent, {
      as: 'TorrentsHostidFkeys',
      foreignKey: 'hostId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });

    Host.hasMany(File, {
      as: 'FilesHostidFkeys',
      foreignKey: 'hostId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });
  };

  return Host;
};
