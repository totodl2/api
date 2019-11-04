module.exports = (sequelize, DataTypes) => {
  const Torrent = sequelize.define(
    'Torrent',
    {
      hash: {
        type: DataTypes.STRING(40),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      eta: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      error: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      errorString: {
        type: DataTypes.STRING(1024),
        allowNull: true,
      },
      downloadDir: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isFinished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      isStalled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      desiredAvailable: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      leftUntilDone: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      sizeWhenDone: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      totalSize: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      magnetLink: {
        type: DataTypes.STRING(2048),
        allowNull: true,
      },
      uploadedEver: {
        type: DataTypes.BIGINT,
      },
      seedRatioLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      seedRatioMode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      uploadRatio: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      peersConnected: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      peersSendingToUs: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      peersGettingFromUs: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      rateDownload: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      rateUpload: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      activityDate: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      trackersJson: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      trackers: DataTypes.VIRTUAL,
    },
    {
      getterMethods: {
        trackersJson: () => undefined,
        trackers: function getTrackers() {
          try {
            return JSON.parse(this.getDataValue('trackersJson'));
          } catch (e) {
            return [];
          }
        },
      },
      setterMethods: {
        trackers: function setTrackers(data) {
          this.setDataValue('trackersJson', JSON.stringify(data));
        },
      },
    },
  );

  Torrent.associate = function associate(models) {
    Torrent.hasMany(models.File, {
      onDelete: 'cascade',
      hooks: true,
      foreignKey: 'torrentHash',
    });
  };

  return Torrent;
};
