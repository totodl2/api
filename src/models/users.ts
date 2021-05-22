import {
  Sequelize,
  DataTypes,
  Optional,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  InstanceUpdateOptions,
} from 'sequelize';
import { Model, ModelAssociateType } from './types';
import { GenreInstance } from './genres';
import { TorrentInstance } from './torrents';
import { RefreshTokenInstance } from './refresh-tokens';

const queue = require('../queues/sse');

const hasRedis = !!process.env.REDIS_HOST;
const { USERS } = queue.NAMES;
const fieldsWatching = ['diskSpace', 'diskUsage'];

export type UserAttributes = {
  id: number;
  nickname: string;
  email: string;
  password: string;
  roles: number;
  uploadRatio: number;
  diskSpace: string; // big int is treated as string
  diskUsage: string; // big int is treated as string
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserAttributes = Optional<
  UserAttributes,
  | 'id'
  | 'uploadRatio'
  | 'roles'
  | 'diskSpace'
  | 'diskUsage'
  | 'createdAt'
  | 'updatedAt'
>;

/**
 *
 User.hasMany(RefreshToken, {
    as: 'refreshTokens',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  });

 User.hasMany(Torrent, {
    as: 'torrents',
    foreignKey: 'userId',
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  });

 User.hasMany(WatchStatus, {
    as: 'watchStatus',
    foreignKey: 'userId',
  });
 */

export type UserAssociations = {
  getTorrents: HasManyGetAssociationsMixin<TorrentInstance>;
  addTorrent: HasManyAddAssociationMixin<TorrentInstance, string>;
  hasTorrent: HasManyHasAssociationMixin<TorrentInstance, string>;
  countTorrents: HasManyCountAssociationsMixin;
  createTorrent: HasManyCreateAssociationMixin<TorrentInstance>;
  removeTorrent: HasManyRemoveAssociationMixin<TorrentInstance, string>;

  getRefreshTokens: HasManyGetAssociationsMixin<RefreshTokenInstance>;
  addRefreshToken: HasManyAddAssociationMixin<RefreshTokenInstance, number>;
  hasRefreshToken: HasManyHasAssociationMixin<RefreshTokenInstance, number>;
  countRefreshTokens: HasManyCountAssociationsMixin;
  createRefreshToken: HasManyCreateAssociationMixin<RefreshTokenInstance>;
  removeRefreshToken: HasManyRemoveAssociationMixin<
    RefreshTokenInstance,
    number
  >;

  // @todo le bloc
  getWatchStatus: HasManyGetAssociationsMixin<any>;
  addWatchStatu: HasManyAddAssociationMixin<any, number>;
  hasWatchStatu: HasManyHasAssociationMixin<any, number>;
  countWatchStatus: HasManyCountAssociationsMixin;
  createWatchStatu: HasManyCreateAssociationMixin<any>;
  removeWatchStatu: HasManyRemoveAssociationMixin<any, number>;
};

export type UserInstance = Model<
  UserAttributes,
  CreateUserAttributes,
  UserAssociations
>;

const createUserRepository = (sequelize: Sequelize) =>
  sequelize.define<UserInstance>(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nickname: {
        type: DataTypes.STRING(32),
        field: 'nickname',
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(64),
        field: 'email',
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        field: 'password',
        allowNull: false,
      },
      roles: {
        type: DataTypes.INTEGER,
        field: 'roles',
        allowNull: false,
        defaultValue: 0,
      },
      uploadRatio: {
        type: DataTypes.INTEGER,
        field: 'uploadRatio',
        allowNull: false,
        defaultValue: 1,
      },
      diskSpace: {
        type: DataTypes.BIGINT,
        field: 'diskSpace',
        allowNull: false,
        defaultValue: 0,
      },
      diskUsage: {
        type: DataTypes.BIGINT,
        field: 'diskUsage',
        allowNull: false,
        defaultValue: 0,
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
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'Users',
      timestamps: true,
      hooks: {
        // dispatch events to bullmq
        afterUpdate: (
          instance: UserInstance,
          { fields }: InstanceUpdateOptions<UserAttributes>,
        ) => {
          if (!hasRedis || !fields) {
            return;
          }

          const filteredFields = fields.filter(field =>
            fieldsWatching.includes(field),
          );
          if (filteredFields.length <= 0) {
            return;
          }

          queue.add(
            USERS.UPDATED.replace('$id', instance.id),
            filteredFields.reduce(
              (prev, field) => ({
                ...prev,
                [field]: instance.dataValues[field],
              }),
              {
                id: instance.id,
                changes: {},
              },
            ),
          );
        },
      },
    },
  );

export type UserRepository = ReturnType<typeof createUserRepository>;

export const associate: ModelAssociateType = repositories => {
  const { User, Torrent, WatchStatus, RefreshToken } = repositories;

  User.hasMany(RefreshToken, {
    as: 'refreshTokens',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  });

  User.hasMany(Torrent, {
    as: 'torrents',
    foreignKey: 'userId',
    onDelete: 'SET NULL',
    onUpdate: 'NO ACTION',
  });

  User.hasMany(WatchStatus, {
    as: 'watchStatus',
    foreignKey: 'userId',
  });
};

export default createUserRepository;
