/* eslint new-cap: "off", global-require: "off", no-unused-vars: "off" */

module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    'File',
    {
      id: {
        type: DataTypes.UUID,
        field: 'id',
        allowNull: false,
        primaryKey: true,
      },
      torrentHash: {
        type: DataTypes.STRING(40),
        field: 'torrentHash',
        allowNull: false,
        references: {
          model: 'Torrents',
          key: 'hash',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING(5120),
        field: 'name',
        allowNull: false,
      },
      basename: {
        type: DataTypes.STRING(1024),
        field: 'basename',
        allowNull: true,
      },
      directory: {
        type: DataTypes.STRING(4096),
        field: 'directory',
        allowNull: true,
      },
      extension: {
        type: DataTypes.STRING(128),
        field: 'extension',
        allowNull: true,
      },
      bytesCompleted: {
        type: DataTypes.BIGINT,
        field: 'bytesCompleted',
        allowNull: false,
        defaultValue: 0,
      },
      length: {
        type: DataTypes.BIGINT,
        field: 'length',
        allowNull: false,
      },
      priority: {
        type: DataTypes.INTEGER,
        field: 'priority',
        allowNull: false,
        defaultValue: 1,
      },
      position: {
        type: DataTypes.INTEGER,
        field: 'position',
        allowNull: false,
        defaultValue: 0,
      },
      wanted: {
        type: DataTypes.BOOLEAN,
        field: 'wanted',
        allowNull: false,
        defaultValue: true,
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
      tableName: 'Files',
      timestamps: true,
    },
  );

  File.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const { Torrent } = models;

    File.belongsTo(Torrent, {
      as: 'RelatedTorrenthash',
      foreignKey: 'torrentHash',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });
  };

  return File;
};