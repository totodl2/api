import { Optional, Sequelize, DataTypes } from 'sequelize';
import { ModelAssociateType, Nullable, Model } from './types';

export type HostAttributes = {
  id: number;
  name: Nullable<string>;
  transmissionServiceUrl: Nullable<string>;
  cdnUrl: Nullable<string>;
  cdnSecret: Nullable<string>;
  spaceAvailable: Nullable<string | number>; // big int treated as string
  spaceReserved: Nullable<string | number>; // big int treated as string
  unavailabilityDetectedAt: Nullable<Date>;
  lastUploadAt: Nullable<Date>;
};

export type CreateHostAttributes = Optional<
  HostAttributes,
  | 'name'
  | 'transmissionServiceUrl'
  | 'cdnUrl'
  | 'cdnSecret'
  | 'spaceAvailable'
  | 'spaceReserved'
  | 'unavailabilityDetectedAt'
  | 'lastUploadAt'
>;

export type HostInstance = Model<HostAttributes, CreateHostAttributes>;

const createHostRepository = (sequelize: Sequelize) =>
  sequelize.define<HostInstance>(
    'Host',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        field: 'name',
        allowNull: true,
      },
      transmissionServiceUrl: {
        type: DataTypes.STRING(255),
        field: 'transmissionServiceUrl',
        allowNull: true,
      },
      cdnUrl: {
        type: DataTypes.STRING(255),
        field: 'cdnUrl',
        allowNull: true,
      },
      cdnSecret: {
        type: DataTypes.STRING(255),
        field: 'cdnSecret',
        allowNull: true,
      },
      spaceAvailable: {
        type: DataTypes.BIGINT,
        field: 'spaceAvailable',
        allowNull: false,
        defaultValue: 0,
      },
      spaceReserved: {
        type: DataTypes.BIGINT,
        field: 'spaceReserved',
        allowNull: false,
        defaultValue: 0,
      },
      unavailabilityDetectedAt: {
        type: DataTypes.DATE,
        field: 'unavailabilityDetectedAt',
        allowNull: true,
      },
      lastUploadAt: {
        type: DataTypes.DATE,
        field: 'lastUploadAt',
        allowNull: true,
      },
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'Hosts',
      timestamps: false,
    },
  );

export type HostRepository = ReturnType<typeof createHostRepository>;

export const associate: ModelAssociateType = repositories => {
  const { File, Host, Torrent } = repositories;

  Host.hasMany(Torrent, {
    as: 'TorrentsHostidFkeys',
    foreignKey: 'hostId',
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  });

  Host.hasMany(File, {
    as: 'FilesHostidFkeys',
    foreignKey: 'hostId',
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  });
};

export default createHostRepository;
