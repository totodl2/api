/* eslint new-cap: "off", global-require: "off", no-unused-vars: "off" */
const queue = require('../queues/sse');
const { normalize } = require('../services/normalizers/files');

const hasRedis = !!process.env.REDIS_HOST;
const { FILES } = queue.NAMES;

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
        unique: false,
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
      transcoded: {
        type: DataTypes.JSON,
        field: 'transcoded',
        allowNull: true,
      },
      transcodingStatus: {
        type: DataTypes.JSON,
        field: 'transcodingStatus',
        allowNull: true,
      },
      transcodingQueuedAt: {
        type: DataTypes.DATE,
        field: 'transcodingQueuedAt',
        allowNull: true,
      },
      transcodingFailedAt: {
        type: DataTypes.DATE,
        field: 'transcodingFailedAt',
        allowNull: true,
      },
      transcodedAt: {
        type: DataTypes.DATE,
        field: 'transcodedAt',
        allowNull: true,
      },
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'Files',
      timestamps: true,
      hooks: {
        // dispatch events to bullmq
        afterCreate: async instance => {
          if (!hasRedis) {
            return;
          }
          const host = await instance.getHost();
          queue.add(FILES.CREATED, {
            hash: instance.torrentHash,
            ...normalize(instance.dataValues, host),
          });
        },
        afterUpdate: async (instance, { fields }) => {
          if (!hasRedis) {
            return;
          }
          const host = await instance.getHost();
          queue.add(FILES.UPDATED, {
            hash: instance.torrentHash,
            id: instance.id,
            changes: normalize(instance.dataValues, host),
          });
        },
      },
    },
  );

  File.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const { Torrent } = models;
    const { Host } = models;

    File.belongsTo(Torrent, {
      as: 'RelatedTorrenthash',
      foreignKey: 'torrentHash',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });

    File.belongsTo(Host, {
      as: 'Host',
      foreignKey: 'hostId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });
  };

  return File;
};
