// eslint-disable-next-line import/no-extraneous-dependencies
import fixtures from 'sequelize-fixtures';
import RefreshToken from './refreshToken';
import { sequelize, repositories } from '../models';

const fixtureUser1TokenName = 'test';
const fixtureUser2TokenName = 'test-1';
const jwtUser1Expired =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZXMiOjAsImlhdCI6MTU3MDA4MzA0NSwiZXhwIjoxNTcwMDgzMDUyfQ.mL6KEYaEQyR1bdgTMJwUxfoNCKjkajyQMFgKrpvvt3opb0UrmT24wFvV8KUjao8oYTdKaKf7QumU7mKC75GbCw';

describe('RefreshToken', () => {
  beforeAll(async () => {
    await sequelize.sync();
    await fixtures.loadFiles(
      ['fixtures/users.js', 'fixtures/refreshTokens.js'],
      repositories,
    );
  });

  afterAll(() => sequelize.dropAllSchemas({}));

  it('Should create a new refresh token', () =>
    RefreshToken.create(1, '0.0.0.0'));

  it('Should verify renew jwt', () =>
    RefreshToken.consume(fixtureUser1TokenName, jwtUser1Expired, '0.0.0.0'));

  it('Should throw if ip mistmatch', () =>
    expect(
      RefreshToken.consume(fixtureUser1TokenName, jwtUser1Expired, '0.0.0.1'),
    ).rejects.toThrow());

  it('Should throw if user mistmatch', () =>
    expect(
      RefreshToken.consume(fixtureUser2TokenName, jwtUser1Expired, '0.0.0.0'),
    ).rejects.toThrow());
});
