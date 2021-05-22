import {
  Sequelize,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  Optional,
} from 'sequelize';
import { Model, ModelAssociateType } from './types';
import { MovieInstance } from './movies';
import { TvInstance } from './tv';

export type GenreAttributes = {
  id: number;
  name: string;
};

export type GenreAssociations = {
  getMovies: HasManyGetAssociationsMixin<MovieInstance>;
  setMovies: HasManySetAssociationsMixin<MovieInstance, number>;
  addMovie: HasManyAddAssociationMixin<MovieInstance, number>;
  hasMovie: HasManyHasAssociationMixin<MovieInstance, number>;
  countMovies: HasManyCountAssociationsMixin;
  createMovie: HasManyCreateAssociationMixin<MovieInstance>;
  removeMovie: HasManyRemoveAssociationMixin<MovieInstance, number>;

  getTv: HasManyGetAssociationsMixin<TvInstance>;
  setTv: HasManySetAssociationsMixin<TvInstance, number>;
  addTv: HasManyAddAssociationMixin<TvInstance, number>;
  hasTv: HasManyHasAssociationMixin<TvInstance, number>;
  countTv: HasManyCountAssociationsMixin;
  createTv: HasManyCreateAssociationMixin<TvInstance>;
  removeTv: HasManyRemoveAssociationMixin<TvInstance, number>;
};

export type CreateGenreAttributes = Optional<GenreAttributes, 'id'>;

export type GenreInstance = Model<
  GenreAttributes,
  CreateGenreAttributes,
  GenreAssociations
>;

const createGenreRepository = (sequelize: Sequelize) =>
  sequelize.define<GenreInstance>(
    'Genre',
    {
      id: {
        type: DataTypes.INTEGER,
        field: 'id',
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      schema: process.env.DATABASE_DIALECT === 'postgres' ? 'public' : '',
      tableName: 'Genres',
      timestamps: false,
    },
  );

export type GenreRepository = ReturnType<typeof createGenreRepository>;

export const associate: ModelAssociateType = repositories => {
  const { Genre, Movie, Tv, MovieGenre, TvGenre } = repositories;

  Genre.belongsToMany(Movie, {
    through: {
      model: MovieGenre,
    },
    foreignKey: 'genreId',
    otherKey: 'movieId',
    as: 'movies',
  });

  Genre.belongsToMany(Tv, {
    through: {
      model: TvGenre,
    },
    foreignKey: 'genreId',
    otherKey: 'tvId',
    as: 'tv',
  });
};

export default createGenreRepository;
