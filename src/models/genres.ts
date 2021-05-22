import { Model, Sequelize, DataTypes } from 'sequelize';
import { ModelStaticType } from './types';

export type GenreAttributes = {
  id: number;
  name: string;
};

export interface GenreModel extends Model<GenreAttributes>, GenreAttributes {}
export class Genre extends Model<GenreModel, GenreAttributes> {}

export type GenreStatic = ModelStaticType<GenreModel>;

const createGenre = (sequelize: Sequelize): GenreStatic => {
  const GenreStaticInstance = <GenreStatic>sequelize.define(
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

  GenreStaticInstance.associate = models => {
    delete module.exports.initRelations; // Destroy itself to prevent repeated calls.

    // associations can be defined here
    Genre.belongsToMany(models.Movie, {
      through: {
        model: models.MovieGenre,
      },
      foreignKey: 'genreId',
      otherKey: 'movieId',
      as: 'movies',
    });

    Genre.belongsToMany(models.Tv, {
      through: {
        model: models.TvGenre,
      },
      foreignKey: 'genreId',
      otherKey: 'tvId',
      as: 'tv',
    });
  };

  return GenreStaticInstance;
};

export default createGenre;
