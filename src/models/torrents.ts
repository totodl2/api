import {
  Sequelize,
  DataTypes,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  InstanceUpdateOptions,
  HasManySetAssociationsMixin,
} from 'sequelize';
import { Model, ModelAssociateType, Nullable } from './types';
import { HostInstance } from './hosts';
import { FileInstance } from './files';
import { UserInstance } from './users';

const queue = require('../queues/sse');
const { normalize } = require('../services/normalizers/torrents');

const hasRedis = !!process.env.REDIS_HOST;
const { TORRENTS } = queue.NAMES;

export enum TorrentStatus {
  STOPPED = 0,
  CHECK_WAIT = 1,
  CHECK = 2,
  DOWNLOAD_WAIT = 3,
  DOWNLOAD = 4,
  SEED_WAIT = 5,
  SEED = 6,
}

export type TrackerType = {
  announce: string | null;
  id: number;
  scrape: string | null;
  tier: number;
};

export type TorrentAttributes = {
  hash: string;
  name: Nullable<string>;
  eta: Nullable<number>;
  status: TorrentStatus;
  error: Nullable<number>;
  errorString: Nullable<string>;
  downloadDir: Nullable<string>;
  isFinished: boolean;
  isStalled: boolean;
  desiredAvailable: Nullable<string | number>; // bigint treated as string
  leftUntilDone: Nullable<string | number>; // bigint treated as string
  sizeWhenDone: Nullable<string | number>; // bigint treated as string
  totalSize: Nullable<string | number>; // bigint treated as string
  magnetLink: Nullable<string>;
  uploadedEver: Nullable<string | number>; // bigint treated as string
  seedRatioLimit: Nullable<number>;
  seedRatioMode: Nullable<number>;
  uploadRatio: Nullable<number>;
  peersConnected: Nullable<number>;
  peersSendingToUs: Nullable<number>;
  peersGettingFromUs: Nullable<number>;
  rateDownload: Nullable<number>;
  rateUpload: Nullable<number>;
  activityDate: Nullable<number>;
  trackers: Nullable<TrackerType[]>;
  createdAt: Date;
  updatedAt: Date;
  userId: Nullable<number>;
  hostId: number;
};

export type CreateTorrentAttributes = Partial<TorrentAttributes> & {
  hash: TorrentAttributes['hash'];
  hostId: TorrentAttributes['hostId'];
};

export type TorrentAssociations = {
  getHost: HasOneGetAssociationMixin<HostInstance>;
  setHost: HasOneSetAssociationMixin<HostInstance, number>;

  getFiles: HasManyGetAssociationsMixin<FileInstance>;
  setFiles: HasManySetAssociationsMixin<FileInstance, string>;
  addFile: HasManyAddAssociationMixin<FileInstance, string>;
  hasFile: HasManyHasAssociationMixin<FileInstance, string>;
  countFiles: HasManyCountAssociationsMixin;
  createFile: HasManyCreateAssociationMixin<FileInstance>;
  removeFile: HasManyRemoveAssociationMixin<FileInstance, string>;

  getUser: HasOneGetAssociationMixin<UserInstance | null>;
  setUser: HasOneSetAssociationMixin<UserInstance, number>;
};

export type TorrentInstance = Model<
  TorrentAttributes,
  CreateTorrentAttributes,
  TorrentAssociations
>;

const createTorrentRepository = (sequelize: Sequelize) =>
  sequelize.define<TorrentInstance>(
    'Torrent',
    {
      hash: {
        type: DataTypes.STRING(40),
        field: 'hash',
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        field: 'name',
        allowNull: true,
      },
      eta: {
        type: DataTypes.INTEGER,
        field: 'eta',
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        field: 'status',
        allowNull: false,
        defaultValue: 0,
      },
      error: {
        type: DataTypes.INTEGER,
        field: 'error',
        allowNull: true,
      },
      errorString: {
        type: DataTypes.STRING(1024),
        field: 'errorString',
        allowNull: true,
      },
      downloadDir: {
        type: DataTypes.STRING(255),
        field: 'downloadDir',
        allowNull: true,
      },
      isFinished: {
        type: DataTypes.BOOLEAN,
        field: 'isFinished',
        allowNull: true,
        defaultValue: false,
      },
      isStalled: {
        type: DataTypes.BOOLEAN,
        field: 'isStalled',
        allowNull: true,
        defaultValue: false,
      },
      desiredAvailable: {
        type: DataTypes.BIGINT,
        field: 'desiredAvailable',
        allowNull: true,
      },
      leftUntilDone: {
        type: DataTypes.BIGINT,
        field: 'leftUntilDone',
        allowNull: true,
      },
      sizeWhenDone: {
        type: DataTypes.BIGINT,
        field: 'sizeWhenDone',
        allowNull: true,
      },
      totalSize: {
        type: DataTypes.BIGINT,
        field: 'totalSize',
        allowNull: true,
      },
      magnetLink: {
        type: DataTypes.STRING(10240),
        field: 'magnetLink',
        allowNull: true,
        set(value: TorrentAttributes['magnetLink']) {
          if (typeof value === 'string' && value.length >= 10240) {
            this.setDataValue('magnetLink', value.substr(0, 10239));
          } else {
            this.setDataValue('magnetLink', value);
          }
        },
      },
      uploadedEver: {
        type: DataTypes.BIGINT,
        field: 'uploadedEver',
        allowNull: true,
      },
      seedRatioLimit: {
        type: DataTypes.INTEGER,
        field: 'seedRatioLimit',
        allowNull: true,
      },
      seedRatioMode: {
        type: DataTypes.INTEGER,
        field: 'seedRatioMode',
        allowNull: true,
        defaultValue: 0,
      },
      uploadRatio: {
        type: DataTypes.FLOAT(53),
        field: 'uploadRatio',
        allowNull: true,
      },
      peersConnected: {
        type: DataTypes.INTEGER,
        field: 'peersConnected',
        allowNull: true,
      },
      peersSendingToUs: {
        type: DataTypes.INTEGER,
        field: 'peersSendingToUs',
        allowNull: true,
      },
      peersGettingFromUs: {
        type: DataTypes.INTEGER,
        field: 'peersGettingFromUs',
        allowNull: true,
      },
      rateDownload: {
        type: DataTypes.INTEGER,
        field: 'rateDownload',
        allowNull: true,
      },
      rateUpload: {
        type: DataTypes.INTEGER,
        field: 'rateUpload',
        allowNull: true,
      },
      activityDate: {
        type: DataTypes.INTEGER,
        field: 'activityDate',
        allowNull: true,
      },
      trackers: {
        type: DataTypes.JSON,
        field: 'trackers',
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'createdAt',
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updatedAt',
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        field: 'userId',
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'SET NULL',
      },
      hostId: {
        type: DataTypes.INTEGER,
        field: 'hostId',
        allowNull: false,
        references: {
          model: 'Hosts',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE',
      },
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'Torrents',
      timestamps: true,
      hooks: {
        // dispatch events to bullmq
        afterUpdate: async (
          instance: TorrentInstance,
          { fields }: InstanceUpdateOptions<TorrentAttributes>,
        ) => {
          if (!hasRedis || !fields) {
            return;
          }

          queue.add(
            TORRENTS.UPDATED,
            fields
              .filter(field => field !== 'trackers')
              .reduce(
                (
                  prev: {
                    hash: string;
                    changes: Partial<TorrentAttributes>;
                  },
                  fieldName,
                ) => ({
                  ...prev,
                  [fieldName]: instance.dataValues[fieldName],
                }),
                {
                  hash: instance.hash,
                  changes: {},
                },
              ),
          );
        },
        afterCreate: async (instance: TorrentInstance) => {
          if (!hasRedis) {
            return;
          }

          const user = await instance.getUser();
          queue.add(
            TORRENTS.CREATED,
            normalize({
              ...instance.dataValues,
              user,
            }),
          );
        },
        afterDestroy(instance: TorrentInstance) {
          if (!hasRedis) {
            return;
          }

          queue.add(TORRENTS.DELETED, { hash: instance.hash });
        },
      },
    },
  );

export type TorrentRepository = ReturnType<typeof createTorrentRepository>;

export const associate: ModelAssociateType = repositories => {
  const { File, Host, User, Torrent } = repositories;

  Torrent.hasMany(File, {
    as: 'Files',
    foreignKey: 'torrentHash',
  });

  Torrent.belongsTo(Host, {
    as: 'Host',
    foreignKey: 'hostId',
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  });

  Torrent.belongsTo(User, {
    as: 'user',
    foreignKey: 'userId',
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  });
};

export default createTorrentRepository;
