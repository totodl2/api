import { Includeable } from 'sequelize';
import path from 'path';
import { File } from '../models';
import Metadata from './metadata';
import {
  CreateFileAttributes,
  FileAttributes,
  FileInstance,
} from '../models/files';
import { MovieInstance } from '../models/movies';
import { TvInstance } from '../models/tv';
import { AddIncludedTypesTo } from '../models/types';

const SUB_EXTENSIONS = ['ssa', 'ass', 'srt'];

const FilesService = {
  /**
   * Get one file by his uuid
   */
  get: <IncludeTypes extends {} = {}>(
    id: string,
    include?: Includeable | Includeable[],
  ) =>
    File.findOne({ where: { id }, include }) as Promise<AddIncludedTypesTo<
      FileInstance,
      IncludeTypes
    > | null>,

  findByIds: <IncludeTypes extends {}>(
    ids: string[],
    include?: Includeable | Includeable[],
  ) =>
    File.findAll({ where: { id: ids }, include }) as Promise<
      AddIncludedTypesTo<FileInstance, IncludeTypes>[]
    >,

  /**
   * Upsert file
   */
  upsert: async function create(
    data: Partial<FileAttributes> & { id: FileAttributes['id'] },
  ) {
    const [file, isNewRecord] = await File.findOrCreate({
      where: { id: data.id },
      defaults: data as CreateFileAttributes,
    });

    if (!isNewRecord) {
      await file.update(data);
    }

    return file;
  },

  /**
   * Search matching subtitle for file @file
   */
  findSubtitle: (
    file: Pick<FileAttributes, 'directory' | 'torrentHash' | 'basename'>,
  ) => {
    const basename = path.basename(
      file.basename!,
      path.extname(file.basename!),
    );
    const filenames = SUB_EXTENSIONS.map(
      extension => `${basename}.${extension}`,
    );

    return File.findOne({
      where: {
        directory: file.directory,
        torrentHash: file.torrentHash,
        basename: filenames,
      },
    });
  },

  /**
   * @param {File} file
   * @param {Movie} movie
   * @return {Promise<void>}
   */
  setMovie: async (file: FileInstance, movie: MovieInstance) => {
    await Metadata.remove(file);
    await file.setMovie(movie);
  },

  /**
   * @param {File} file
   * @param {Tv} tv
   * @param {number} seasonNumber
   * @param {number} episodeNumber
   * @returns {Promise<void>}
   */
  setTv: async (
    file: FileInstance,
    tv: TvInstance | number,
    seasonNumber: number,
    episodeNumber: number,
  ) => {
    await Metadata.remove(file);
    /* eslint-disable require-atomic-updates,no-param-reassign */
    file.seasonNumber = seasonNumber;
    file.episodeNumber = episodeNumber;
    await file.setTv(tv);
    await file.save();
    /* eslint-enable no-param-reassign */
  },
};

export default FilesService;
module.exports = FilesService; // @todo : remove me
