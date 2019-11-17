/* eslint new-cap: "off", global-require: "off", no-unused-vars: "off" */
const paginator = require('../utils/paginator');

module.exports = (sequelize, DataTypes) => {
  const Torrent = sequelize.define(
    'Torrent',
    {
      hash: {
        type: DataTypes.STRING(40),
        field: 'hash',
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        field: 'name',
        allowNull: true,
      },
      eta: {
        type: DataTypes.INTEGER,
        field: 'eta',
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        field: 'status',
        allowNull: false,
        defaultValue: 0,
      },
      error: {
        type: DataTypes.INTEGER,
        field: 'error',
        allowNull: true,
      },
      errorString: {
        type: DataTypes.STRING(1024),
        field: 'errorString',
        allowNull: true,
      },
      downloadDir: {
        type: DataTypes.STRING(255),
        field: 'downloadDir',
        allowNull: true,
      },
      isFinished: {
        type: DataTypes.BOOLEAN,
        field: 'isFinished',
        allowNull: true,
        defaultValue: false,
      },
      isStalled: {
        type: DataTypes.BOOLEAN,
        field: 'isStalled',
        allowNull: true,
        defaultValue: false,
      },
      desiredAvailable: {
        type: DataTypes.BIGINT,
        field: 'desiredAvailable',
        allowNull: true,
      },
      leftUntilDone: {
        type: DataTypes.BIGINT,
        field: 'leftUntilDone',
        allowNull: true,
      },
      sizeWhenDone: {
        type: DataTypes.BIGINT,
        field: 'sizeWhenDone',
        allowNull: true,
      },
      totalSize: {
        type: DataTypes.BIGINT,
        field: 'totalSize',
        allowNull: true,
      },
      magnetLink: {
        type: DataTypes.STRING(10240),
        field: 'magnetLink',
        allowNull: true,
      },
      uploadedEver: {
        type: DataTypes.BIGINT,
        field: 'uploadedEver',
        allowNull: true,
      },
      seedRatioLimit: {
        type: DataTypes.INTEGER,
        field: 'seedRatioLimit',
        allowNull: true,
      },
      seedRatioMode: {
        type: DataTypes.INTEGER,
        field: 'seedRatioMode',
        allowNull: true,
        defaultValue: 0,
      },
      uploadRatio: {
        type: DataTypes.FLOAT(53),
        field: 'uploadRatio',
        allowNull: true,
      },
      peersConnected: {
        type: DataTypes.INTEGER,
        field: 'peersConnected',
        allowNull: true,
      },
      peersSendingToUs: {
        type: DataTypes.INTEGER,
        field: 'peersSendingToUs',
        allowNull: true,
      },
      peersGettingFromUs: {
        type: DataTypes.INTEGER,
        field: 'peersGettingFromUs',
        allowNull: true,
      },
      rateDownload: {
        type: DataTypes.INTEGER,
        field: 'rateDownload',
        allowNull: true,
      },
      rateUpload: {
        type: DataTypes.INTEGER,
        field: 'rateUpload',
        allowNull: true,
      },
      activityDate: {
        type: DataTypes.INTEGER,
        field: 'activityDate',
        allowNull: true,
      },
      trackers: {
        type: DataTypes.JSON,
        field: 'trackers',
        allowNull: true,
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
      userId: {
        type: DataTypes.INTEGER,
        field: 'userId',
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'SET NULL',
      },
      hostId: {
        type: DataTypes.INTEGER,
        field: 'hostId',
        allowNull: false,
        references: {
          model: 'Hosts',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE',
      },
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'Torrents',
      timestamps: true,
    },
  );

  Torrent.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const { File } = models;
    const { Host } = models;
    const { User } = models;

    Torrent.hasMany(File, {
      as: 'FilesTorrenthashFkeys',
      foreignKey: 'torrentHash',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });

    Torrent.belongsTo(Host, {
      as: 'Host',
      foreignKey: 'hostId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });

    Torrent.belongsTo(User, {
      as: 'User',
      foreignKey: 'userId',
      onDelete: 'SET NULL',
      onUpdate: 'NO ACTION',
    });
  };

  return Torrent;
};
