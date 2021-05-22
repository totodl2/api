import {
  Sequelize,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
} from 'sequelize';
import { Model, ModelAssociateType } from './types';

export type GenreAttributes = {
  id: number;
  name: string;
};

export type GenreAssociations = {
  getMovies: HasManyGetAssociationsMixin<any>; // @todo
  addMovie: HasManyAddAssociationMixin<any, number>; // @todo
  hasMovie: HasManyHasAssociationMixin<any, number>; // @todo
  countMovies: HasManyCountAssociationsMixin;
  createMovie: HasManyCreateAssociationMixin<any>; // @todo
  removeMovie: HasManyRemoveAssociationMixin<any, number>; // @todo

  getTv: HasManyGetAssociationsMixin<any>; // @todo
  addTv: HasManyAddAssociationMixin<any, number>; // @todo
  hasTv: HasManyHasAssociationMixin<any, number>; // @todo
  countTv: HasManyCountAssociationsMixin;
  createTv: HasManyCreateAssociationMixin<any>; // @todo
  removeTv: HasManyRemoveAssociationMixin<any, number>; // @todo
};

export type GenreInstance = Model<
  GenreAttributes,
  GenreAttributes,
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
