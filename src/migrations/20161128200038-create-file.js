module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'Files',
      {
        id: {
          allowNull: false,
          primaryKey: true,
          unique: true,
          defaultValue: Sequelize.UUIDV4,
          type: Sequelize.UUID,
        },
        torrentHash: {
          type: Sequelize.STRING(40),
          allowNull: false,
          references: { model: 'Torrents', key: 'hash' },
          onDelete: 'cascade',
        },
        name: {
          type: Sequelize.STRING(5120),
          allowNull: false,
        },
        basename: {
          type: Sequelize.STRING(1024),
          allowNull: true,
        },
        directory: {
          type: Sequelize.STRING(4096),
          allowNull: true,
        },
        extension: {
          type: Sequelize.STRING(128),
          allowNull: true,
        },
        bytesCompleted: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        length: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false,
        },
        priority: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 1,
          allowNull: false,
        },
        position: {
          type: Sequelize.INTEGER.UNSIGNED,
          defaultValue: 0,
          allowNull: false,
        },
        wanted: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
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
    ),
  down: queryInterface => queryInterface.dropTable('Files'),
};
