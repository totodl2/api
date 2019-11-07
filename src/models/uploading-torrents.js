/* eslint new-cap: "off", global-require: "off", no-unused-vars: "off" */

module.exports = (sequelize, DataTypes) => {
  const UploadingTorrent = sequelize.define(
    'UploadingTorrent',
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
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'UploadingTorrents',
      timestamps: false,
    },
  );

  UploadingTorrent.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const { User } = models;

    UploadingTorrent.belongsTo(User, {
      as: 'User',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });
  };

  return UploadingTorrent;
};
