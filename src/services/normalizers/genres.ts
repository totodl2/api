import { GenreAttributes } from '../../models/genres';

export type NormalizedGenreType = { id: number; name: string };

const normalizeOne = ({ id, name }: GenreAttributes): NormalizedGenreType => ({
  id,
  name,
});

export const normalize = (genre: GenreAttributes | GenreAttributes[]) => {
  if (Array.isArray(genre)) {
    return genre.map(g => normalizeOne(g));
  }
  return normalizeOne(genre);
};
