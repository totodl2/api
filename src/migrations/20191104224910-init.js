module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      'Users',
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
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );

    await queryInterface.createTable(
      'UploadingTorrents',
      {
        reference: {
          type: DataTypes.STRING(255),
          field: 'reference',
          allowNull: false,
          primaryKey: true,
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
      },
      {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );

    await queryInterface.createTable(
      'Hosts',
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
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );

    await queryInterface.createTable(
      'Torrents',
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
          type: DataTypes.STRING(2048),
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
        trackersJson: {
          type: DataTypes.TEXT,
          field: 'trackersJson',
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
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );

    await queryInterface.createTable(
      'Files',
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
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    );

    await queryInterface.addIndex('Torrents', ['userId'], {
      name: 'Torrents_userId_idx',
    });
    await queryInterface.addIndex('UploadingTorrents', ['userId'], {
      name: 'UploadingTorrents_userId_idx',
    });
    await queryInterface.addIndex('Hosts', ['name'], {
      name: 'Hosts_name_idx',
    });
    await queryInterface.addIndex('Torrents', ['hostId'], {
      name: 'Torrents_hostId_idx',
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('UploadingTorrents');
    await queryInterface.dropTable('Torrents');
    await queryInterface.dropTable('Hosts');
    await queryInterface.dropTable('Files');
  },
};
