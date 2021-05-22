import { Model as SequelizeModel } from 'sequelize';
import { RepositoriesTypes } from './index';

export type ModelAssociateType = (repositories: RepositoriesTypes) => void;

export type AddIncludedTypesTo<
  Instance extends Model,
  IncludedTypes extends {}
> = Instance &
  IncludedTypes &
  (Instance extends { dataValues: any }
    ? {
        dataValues: Instance['dataValues'] & IncludedTypes;
      }
    : {});

export type Model<
  TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes,
  Associations extends {} = {},
  InstanceVirtualAttributes extends {} = {}
> = SequelizeModel<TModelAttributes, TCreationAttributes> &
  TModelAttributes &
  InstanceVirtualAttributes &
  Associations & {
    dataValues: TModelAttributes;
  };

export type Nullable<T> = T | null | undefined;
