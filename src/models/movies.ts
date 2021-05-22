import {
  Sequelize,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  Optional,
  HasManySetAssociationsMixin,
} from 'sequelize';
import { Model, ModelAssociateType, Nullable } from './types';
import { MovieType } from '../types/MetadataTypes';
import { GenreInstance } from './genres';
import { FileInstance } from './files';

export type MovieAttributes = {
  id: number;
  adult: Nullable<boolean>;
  backdropPath: Nullable<string>;
  budget: Nullable<string | number>; // bigint is treated as string
  homepage: Nullable<string>;
  imdbId: Nullable<string>;
  originalLanguage: Nullable<string>;
  originalTitle: Nullable<string>;
  overview: Nullable<string>;
  popularity: Nullable<number>;
  posterPath: Nullable<string>;
  releaseDate: Nullable<Date>;
  runtime: Nullable<number>;
  status: Nullable<string>;
  tagline: Nullable<any>;
  title: Nullable<string>;
  voteAverage: Nullable<number>;
  voteCount: Nullable<number>;
  productionCompanies: Nullable<MovieType['productionCompanies']>;
  productionCountries: Nullable<MovieType['productionCountries']>;
  spokenLanguages: Nullable<MovieType['spokenLanguages']>;
  videos: Nullable<MovieType['videos']>;
  credits: Nullable<MovieType['credits']>;
  images: Nullable<MovieType['images']>;
  keywords: Nullable<MovieType['keywords']>;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateMovieAttributes = Partial<MovieAttributes>;

export type MovieAssociations = {
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

export type MovieInstance = Model<
  MovieAttributes,
  CreateMovieAttributes,
  MovieAssociations
>;

const createMovieRepository = (sequelize: Sequelize) =>
  sequelize.define<MovieInstance>(
    'Movie',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
      },
      adult: DataTypes.BOOLEAN,
      backdropPath: DataTypes.STRING,
      budget: DataTypes.BIGINT,
      homepage: DataTypes.STRING,
      imdbId: DataTypes.STRING,
      originalLanguage: DataTypes.STRING(8),
      originalTitle: DataTypes.STRING,
      overview: DataTypes.TEXT,
      popularity: DataTypes.FLOAT,
      posterPath: DataTypes.STRING,
      releaseDate: DataTypes.DATE,
      runtime: DataTypes.INTEGER,
      status: DataTypes.STRING,
      tagline: DataTypes.STRING,
      title: DataTypes.STRING,
      voteAverage: DataTypes.FLOAT,
      voteCount: DataTypes.INTEGER,
      productionCompanies: DataTypes.JSON,
      productionCountries: DataTypes.JSON,
      spokenLanguages: DataTypes.JSON,
      videos: DataTypes.JSON,
      credits: DataTypes.JSON,
      images: DataTypes.JSON,
      keywords: DataTypes.JSON,
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
      tableName: 'Movies',
    },
  );

export type MovieRepository = ReturnType<typeof createMovieRepository>;

export const associate: ModelAssociateType = repositories => {
  const { Movie, Genre, MovieGenre, File } = repositories;
  Movie.belongsToMany(Genre, {
    through: {
      model: MovieGenre,
    },
    foreignKey: 'movieId',
    otherKey: 'genreId',
    as: 'genres',
  });

  Movie.hasMany(File, { foreignKey: 'movieId', as: 'files' });
};

export default createMovieRepository;
