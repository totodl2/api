// eslint-disable-next-line import/no-extraneous-dependencies
import fixtures from 'sequelize-fixtures';
import Files from './files';
import Movies from './movies';
import Tv from './tv';
import { sequelize, repositories } from '../models';
import { MovieInstance } from '../models/movies';
import { TvInstance } from '../models/tv';

describe('Files', () => {
  beforeAll(async () => {
    await sequelize.sync();
    await fixtures.loadFiles(
      [
        'fixtures/users.js',
        'fixtures/hosts.js',
        'fixtures/torrents.js',
        'fixtures/movies.js',
        'fixtures/tv.js',
        'fixtures/files.js',
      ],
      repositories,
    );
  });

  afterAll(() => sequelize.dropAllSchemas({}));

  it('Should retreive file', async () => {
    const result = await Files.get('a8a4e9d0-9639-4fcd-acc1-1703dc2b2890');
    expect(result).not.toBe(null);
  });

  it('Should update file', async () => {
    const file = await Files.upsert({
      id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2891',
      bytesCompleted: 2,
    });
    expect(file.dataValues).toMatchObject({
      id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2891',
      bytesCompleted: 2,
    });
  });

  it('Should find the subtitle when needed', async () => {
    const file = await Files.get('a8a4e9d0-9639-4fcd-acc1-1703dc2b2891');
    const sub = await Files.findSubtitle({
      basename: file!.basename!,
      directory: file!.directory,
      torrentHash: file!.torrentHash,
    });
    expect(sub!.id).toBe('4a061ef9-5514-4266-aa2e-e2df340e17d9');

    const noSubFile = await Files.get('a8a4e9d0-9639-4fcd-acc1-1703dc2b2892');
    const noSub = await Files.findSubtitle({
      basename: noSubFile!.basename!,
      directory: noSubFile!.directory,
      torrentHash: noSubFile!.torrentHash,
    });
    expect(noSub).toBe(null);
  });

  it('should set movie to file', async () => {
    const file = await Files.get('a8a4e9d0-9639-4fcd-acc1-1703dc2b2890');
    const movieId = 1;
    const movie = await Movies.get(movieId);
    await Files.setMovie(file!, movie!);
    expect(
      (await Files.get<{ movie?: MovieInstance | null }>(file!.id, 'movie'))!
        .movie!.id,
    ).toBe(movieId);
  });

  it('should set tv to file', async () => {
    const file = await Files.get('a8a4e9d0-9639-4fcd-acc1-1703dc2b2892');
    const tvId = 42;
    const tv = await Tv.get(tvId);
    await Files.setTv(file!, tv!, 1, 1);
    expect(
      (await Files.get<{ tv?: TvInstance | null }>(file!.id, 'tv'))!.tv!.id,
    ).toBe(tvId);
  });
});
