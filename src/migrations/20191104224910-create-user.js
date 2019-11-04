module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable(
        'Users',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER.UNSIGNED,
          },
          nickname: {
            type: Sequelize.STRING(32),
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING(64),
            allowNull: false,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          roles: {
            type: Sequelize.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0,
          },
          uploadRatio: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
          },
          diskSpace: {
            allowNull: false,
            type: Sequelize.BIGINT.UNSIGNED,
          },
          diskUsage: {
            allowNull: false,
            type: Sequelize.BIGINT.UNSIGNED,
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
