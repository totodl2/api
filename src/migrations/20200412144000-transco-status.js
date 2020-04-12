module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.renameColumn(
      'Files',
      'transcodingAt',
      'transcodingQueuedAt',
    );
    await queryInterface.addColumn('Files', 'transcodingStatus', {
      type: DataTypes.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Files', 'transcodingFailedAt', {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },
  down: async queryInterface => {
    await queryInterface.dropColumn('Files', 'transcodingStatus');
    await queryInterface.dropColumn('Files', 'transcodingFailedAt');
    await queryInterface.renameColumn(
      'Files',
      'transcodingQueuedAt',
      'transcodingAt',
    );
  },
};
