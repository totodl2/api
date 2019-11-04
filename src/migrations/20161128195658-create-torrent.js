module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable(
        'Torrents',
        {
          hash: {
            type: Sequelize.STRING(40),
            primaryKey: true,
            unique: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          eta: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false,
          },
          error: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          errorString: {
            type: Sequelize.STRING(1024),
            allowNull: true,
          },
          downloadDir: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          isFinished: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: true,
          },
          isStalled: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: true,
          },
          desiredAvailable: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: true,
          },
          leftUntilDone: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: true,
          },
          sizeWhenDone: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: true,
          },
          totalSize: {
            type: Sequelize.BIGINT.UNSIGNED,
            allowNull: true,
          },
          magnetLink: {
            type: Sequelize.STRING(2048),
            allowNull: true,
          },
          uploadedEver: {
            type: Sequelize.BIGINT,
          },
          seedRatioLimit: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          seedRatioMode: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },
          uploadRatio: {
            type: Sequelize.FLOAT,
            allowNull: true,
          },
          peersConnected: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          peersSendingToUs: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          peersGettingFromUs: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          rateDownload: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          rateUpload: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          activityDate: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: true,
          },
          trackersJson: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        {
          charset: 'utf8',
          collate: 'utf8_general_ci',
        },
      )
      .then(() => {
        /* queryInterface.addIndex(
        'Torrents',
        ['hash'],
        {
          indexName: 'hashUnique',
          indicesType: 'UNIQUE'
        }
      ); */
      }),
  down: queryInterface => queryInterface.dropTable('Torrents'),
};
