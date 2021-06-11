import {
  Sequelize,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManySetAssociationsMixin,
} from 'sequelize';
import { Model, ModelAssociateType, Nullable } from './types';
import { TvType } from '../types/MetadataTypes';
import { GenreInstance } from './genres';
import { FileInstance } from './files';

export type TvAttributes = {
  id: number;
  backdropPath: Nullable<string>;
  firstAirDate: Nullable<Date>;
  lastAirDate: Nullable<Date>;
  homepage: Nullable<string>;
  name: Nullable<string>;
  numberOfEpisodes: Nullable<number>;
  numberOfSeasons: Nullable<number>;
  originalLanguage: Nullable<string>;
  originalName: Nullable<string>;
  inProduction: Nullable<boolean>;
  overview: Nullable<string>;
  popularity: Nullable<number>;
  posterPath: Nullable<string>;
  status: Nullable<string>;
  type: Nullable<string>;
  voteAverage: Nullable<number>;
  voteCount: Nullable<number>;
  externalIds: Nullable<TvType['externalIds']>;
  episodeRunTime: Nullable<TvType['episodeRunTime']>;
  networks: Nullable<TvType['networks']>;
  originCountry: Nullable<TvType['originCountry']>;
  images: Nullable<TvType['images']>;
  credits: Nullable<TvType['credits']>;
  keywords: Nullable<TvType['keywords']>;
  videos: Nullable<TvType['videos']>;
  seasons: Nullable<TvType['seasons']>;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTvAttributes = Partial<TvAttributes>;

export type TvAssociations = {
  getGenres: HasManyGetAssociationsMixin<GenreInstance>;
  setGenres: HasManySetAssociationsMixin<GenreInstance, number>;
  addGenre: HasManyAddAssociationMixin<GenreInstance, number>;
  hasGenre: HasManyHasAssociationMixin<GenreInstance, number>;
  countGenres: HasManyCountAssociationsMixin;
  createGenre: HasManyCreateAssociationMixin<GenreInstance>;
  removeGenre: HasManyRemoveAssociationMixin<GenreInstance, number>;

  getFiles: HasManyGetAssociationsMixin<FileInstance>;
  setFiles: HasManySetAssociationsMixin<FileInstance, string>;
  addFile: HasManyAddAssociationMixin<FileInstance, string>;
  hasFile: HasManyHasAssociationMixin<FileInstance, string>;
  countFiles: HasManyCountAssociationsMixin;
  createFile: HasManyCreateAssociationMixin<FileInstance>;
  removeFile: HasManyRemoveAssociationMixin<FileInstance, string>;
};

export type TvInstance = Model<
  TvAttributes,
  CreateTvAttributes,
  TvAssociations
>;

const createTvRepository = (sequelize: Sequelize) =>
  sequelize.define<TvInstance>(
    'Tv',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
      },
      backdropPath: DataTypes.STRING,
      firstAirDate: DataTypes.DATE,
      lastAirDate: DataTypes.DATE,
      homepage: DataTypes.STRING,
      name: DataTypes.STRING,
      numberOfEpisodes: DataTypes.INTEGER,
      numberOfSeasons: DataTypes.INTEGER,
      originalLanguage: DataTypes.STRING,
      originalName: DataTypes.STRING,
      inProduction: DataTypes.BOOLEAN,
      overview: DataTypes.TEXT,
      popularity: DataTypes.FLOAT,
      posterPath: DataTypes.STRING,
      status: DataTypes.STRING,
      type: DataTypes.STRING,
      voteAverage: DataTypes.FLOAT,
      voteCount: DataTypes.INTEGER,
      externalIds: DataTypes.JSON,
      episodeRunTime: DataTypes.JSON,
      networks: DataTypes.JSON,
      originCountry: DataTypes.JSON,
      images: DataTypes.JSON,
      credits: DataTypes.JSON,
      keywords: DataTypes.JSON,
      videos: DataTypes.JSON,
      seasons: DataTypes.JSON,
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
      timestamps: true,
      tableName: 'Tv',
    },
  );

export type TvRepository = ReturnType<typeof createTvRepository>;

export const associate: ModelAssociateType = repositories => {
  const { Genre, Tv, File, TvGenre } = repositories;

  Tv.belongsToMany(Genre, {
    through: {
      model: TvGenre,
    },
    foreignKey: 'tvId',
    otherKey: 'genreId',
    as: 'genres',
  });

  Tv.hasMany(File, {
    foreignKey: 'tvId',
    as: 'files',
  });
};

export default createTvRepository;
