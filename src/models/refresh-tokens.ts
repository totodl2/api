import {
  Sequelize,
  DataTypes,
  Optional,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from 'sequelize';
import { Model, ModelAssociateType, Nullable } from './types';

export type RefreshTokenAttributes = {
  id: number;
  userId: number;
  token: string;
  ip: string;
  lastUsedAt: Nullable<Date>;
  updatedAt: Date;
  createdAt: Date;
};

export type CreateRefreshTokenAttributes = Optional<
  RefreshTokenAttributes,
  'id' | 'createdAt' | 'updatedAt'
>;

export type RefreshTokenAssociation = {
  getUser: HasOneGetAssociationMixin<any>; // @todo
  setUser: HasOneSetAssociationMixin<any, number>; // @todo
};

export type RefreshTokenInstance = Model<
  RefreshTokenAttributes,
  CreateRefreshTokenAttributes,
  RefreshTokenAssociation
>;

const createRefreshTokenRepository = (sequelize: Sequelize) =>
  sequelize.define(
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

export type RefreshTokenRepository = ReturnType<
  typeof createRefreshTokenRepository
>;

export const associate: ModelAssociateType = repositories => {
  const { User, RefreshToken } = repositories;

  RefreshToken.belongsTo(User, {
    as: 'User',
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  });
};

export default createRefreshTokenRepository;
