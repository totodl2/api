module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      nickname: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          len: [2, 32],
        },
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      passwordC: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
          len: [4, 64],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uploadRatio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      roles: {
        type: DataTypes.INTEGER.UNSIGNED,
      },
      diskSpace: {
        allowNull: false,
        type: DataTypes.BIGINT.UNSIGNED,
      },
      diskUsage: {
        allowNull: false,
        type: DataTypes.BIGINT.UNSIGNED,
      },
    },
    {
      getterMethods: {
        public: function getPublic() {
          return {
            id: this.id,
            nickname: this.nickname,
            roles: this.roles,
            uploadRatio: this.uploadRatio,
            diskSpace: this.diskSpace,
            diskUsage: this.diskUsage,
          };
        },
      },
    },
  );

  User.associate = function associate(/* models */) {
    //  models['User'].hasMany(models['Torrent'], { as: 'torrents', through: 'uid' });
  };

  return User;
};
