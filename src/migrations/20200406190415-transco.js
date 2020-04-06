module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('Files', 'transcoded', {
      type: DataTypes.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Files', 'transcodingAt', {
      type: DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Files', 'transcodedAt', {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },
  down: async queryInterface => {
    await queryInterface.dropColumn('Files', 'transcoded');
    await queryInterface.dropColumn('Files', 'transcodingAt');
    await queryInterface.dropColumn('Files', 'transcodedAt');
  },
};
