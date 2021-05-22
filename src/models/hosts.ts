import { Model, Sequelize, DataTypes } from 'sequelize';
import { ModelStaticType, Nullable } from './types';

export type GenreAttributes = {
  id: number;
  name: Nullable<string>;
  transmissionServiceUrl: Nullable<string>;
  cdnUrl: Nullable<string>;
  cdnSecret: Nullable<string>;
  spaceAvailable: Nullable<string>; // big int treated as string
  spaceReserved: Nullable<string>; // big int treated as string
  unavailabilityDetectedAt: Nullable<Date>;
  lastUploadAt: Nullable<Date>;
};

export interface HostModel extends Model<GenreAttributes>, GenreAttributes {}
export class Host extends Model<HostModel, GenreAttributes> {}

export type HostStatic = ModelStaticType<HostModel>;

const createHost = (sequelize: Sequelize): HostStatic => {
  const HostStaticInstance = <HostStatic>sequelize.define(
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

  HostStaticInstance.associate = models => {
    const { File } = models;

    HostStaticInstance.hasMany(models.Torrent, {
      as: 'TorrentsHostidFkeys',
      foreignKey: 'hostId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });

    HostStaticInstance.hasMany(File, {
      as: 'FilesHostidFkeys',
      foreignKey: 'hostId',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });
  };

  return HostStaticInstance;
};

export default createHost;
