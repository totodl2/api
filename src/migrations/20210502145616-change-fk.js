module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('Files', 'hash', {
      type: DataTypes.STRING(40),
      field: 'torrentHash',
      allowNull: true,
    });
    await queryInterface.removeConstraint('Files', 'Files_torrentHash_fkey');
    await queryInterface.addConstraint('Files', {
      fields: ['torrentHash'],
      type: 'foreign key',
      name: 'Files_torrentHash_fkey',
      references: {
        table: 'Torrents',
        field: 'hash',
      },
      onDelete: 'SET NULL',
      onUpdate: 'NO ACTION',
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeConstraint('Files', 'Files_torrentHash_fkey');
    await queryInterface.addConstraint('Files', {
      fields: ['torrentHash'],
      type: 'foreign key',
      name: 'Files_torrentHash_fkey',
      references: {
        table: 'Torrents',
        field: 'hash',
      },
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });
    await queryInterface.changeColumn('Files', 'hash', {
      type: DataTypes.STRING(40),
      field: 'torrentHash',
      allowNull: false,
    });
  },
};
