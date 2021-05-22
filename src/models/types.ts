import { Model as SequelizeModel } from 'sequelize';
import { RepositoriesTypes } from './index';

export type ModelAssociateType = (repositories: RepositoriesTypes) => void;

export type Model<
  TModelAttributes extends {} = any,
  TCreationAttributes extends {} = TModelAttributes,
  Associations extends {} = {}
> = SequelizeModel<TModelAttributes, TCreationAttributes> &
  TModelAttributes &
  Associations & {
    dataValues: TModelAttributes;
  };

export type Nullable<T> = T | null | undefined;
