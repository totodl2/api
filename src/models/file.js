const path = require('path');

module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define(
    'File',
    {
      id: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      torrentHash: {
        type: DataTypes.STRING(40),
        allowNull: false,
        references: { model: 'Torrents', key: 'hash' },
        onDelete: 'cascade',
      },
      name: {
        type: DataTypes.STRING(5120),
        allowNull: false,
      },
      basename: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
      directory: {
        type: DataTypes.STRING(4096),
        allowNull: true,
      },
      extension: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      bytesCompleted: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
      length: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      priority: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 1,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: false,
      },
      wanted: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      setterMethods: {
        name: function getName(value) {
          const directory = path.dirname(value);
          const extension = path.extname(value);
          const basename = path.basename(value);

          this.setDataValue('directory', directory === '.' ? null : directory);
          this.setDataValue('basename', basename.length <= 0 ? null : basename);
          this.setDataValue(
            'extension',
            extension.length > 0 ? extension.substring(1) : null,
          );
          this.setDataValue('name', value);
        },
      },
    },
  );

  File.associate = function associate(models) {
    File.belongsTo(models.Torrent, {
      onDelete: 'CASCADE',
    });
  };

  return File;
};
