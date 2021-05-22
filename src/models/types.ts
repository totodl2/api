import { BuildOptions, Model } from 'sequelize';
import { ModelsTypes } from './index';

export type ModelStaticType<ModelType> = typeof Model & {
  new (values?: object, options?: BuildOptions): ModelType;
  associate?: (models: ModelsTypes) => void;
};

export type Nullable<T> = T | null | undefined;
