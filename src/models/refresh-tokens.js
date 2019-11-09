/* eslint new-cap: "off", global-require: "off", no-unused-vars: "off" */

module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      token: {
        type: DataTypes.STRING(255),
        field: 'token',
        allowNull: false,
      },
      ip: {
        type: DataTypes.STRING(255),
        field: 'ip',
        allowNull: false,
      },
      lastUsedAt: {
        type: DataTypes.DATE,
        field: 'lastUsedAt',
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updatedAt',
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'createdAt',
        allowNull: false,
      },
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'RefreshTokens',
      timestamps: true,
    },
  );

  RefreshToken.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    const { User } = models;

    RefreshToken.belongsTo(User, {
      as: 'User',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
      unique: false,
    });
  };

  return RefreshToken;
};
