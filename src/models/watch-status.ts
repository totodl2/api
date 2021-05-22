import {
  Sequelize,
  DataTypes,
  Optional,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from 'sequelize';
import { Model, ModelAssociateType, Nullable } from './types';
import { TorrentInstance } from './torrents';
import { UserInstance } from './users';
import { FileInstance } from './files';
import { Defined } from '../types/TypesHelper';

export type WatchStatusAttributes = {
  id: number;
  userId: number;
  fileId: Nullable<string>;
  tvId: Nullable<number>;
  seasonNumber: Nullable<number>;
  episodeNumber: Nullable<number>;
  movieId: Nullable<number>;
  position: number;
  length: number;
};

export type CreateWatchStatusAttributes = Defined<
  Partial<WatchStatusAttributes>,
  'userId'
>;

export type WatchStatusAssociations = {
  getUser: HasOneGetAssociationMixin<UserInstance>;
  setUser: HasOneSetAssociationMixin<UserInstance, number>;
  getFile: HasOneGetAssociationMixin<FileInstance>;
  setFile: HasOneSetAssociationMixin<FileInstance, number>;
};

export type WatchStatusInstance = Model<
  WatchStatusAttributes,
  CreateWatchStatusAttributes,
  WatchStatusAssociations
>;

const createWatchStatusRepository = (sequelize: Sequelize) =>
  sequelize.define<WatchStatusInstance>(
    'WatchStatus',
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
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE',
      },
      fileId: {
        type: DataTypes.UUID,
        field: 'fileId',
        allowNull: true,
        references: {
          model: 'Files',
          key: 'id',
        },
        onUpdate: 'NO ACTION',
        onDelete: 'CASCADE',
      },
      tvId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      seasonNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      episodeNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'WatchStatus',
      timestamps: true,
    },
  );

export type WatchStatusRepository = ReturnType<
  typeof createWatchStatusRepository
>;

export const associate: ModelAssociateType = repositories => {
  const { User, File, WatchStatus } = repositories;

  WatchStatus.belongsTo(User, {
    as: 'user',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  });

  WatchStatus.belongsTo(File, {
    as: 'file',
    foreignKey: 'fileId',
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  });
};

export default createWatchStatusRepository;
