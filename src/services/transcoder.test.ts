/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import fixtures from 'sequelize-fixtures';
import MockAdapter from 'axios-mock-adapter';

import Files from './files';
import { sequelize, repositories } from '../models';

import { Transcoder } from './transcoder';

const testConf = {
  extensions: ['avi', 'mkv', 'mp4'],
  transcoders: {
    'audio-sub': {
      url: 'http://transco-audio',
      apiKey: 'audio',
    },
    video: {
      url: 'http://transco-video',
      apiKey: 'video',
    },
  },
  muxer: {
    url: 'http://muxer',
    uploadPath: '/upload',
    endPath: '/end',
    apiKey: 'muxer',
  },
  notify: {
    url: 'http://notify',
    path: '/notify',
    apiKey: 'notify',
  },
  progress: {
    url: 'http://progress',
    path: '/progress',
    apiKey: 'progress',
  },
};

describe('Transcoder', () => {
  const mediaFileId = 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2890';
  const otherFileId = '27bb08c8-db16-4d1f-b0d2-44f70f39cd0a';
  let mock: MockAdapter;
  const transcoder = new Transcoder(testConf);

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
    mock = new MockAdapter(axios);
  });

  afterAll(async () => {
    mock.restore();
    await sequelize.dropAllSchemas({});
  });

  afterEach(() => {
    mock.resetHandlers();
  });

  it('should not be enabled', () => {
    expect(new Transcoder().enabled).toBe(false);
  });

  it('should be enabled', () => {
    expect(transcoder.enabled).toBe(true);
  });

  it('should not be compatible', async () => {
    const file = await Files.get(otherFileId);
    expect(transcoder.isCompatible(file!)).toBe(false);
  });

  it('should be compatible', async () => {
    const file = await Files.get(mediaFileId);
    expect(transcoder.isCompatible(file!)).toBe(true);
  });

  it('should support media', async () => {
    const file = await Files.get(mediaFileId);
    const calledExpected = [
      { url: '/support', baseURL: testConf.transcoders['audio-sub'].url },
      { url: '/support', baseURL: testConf.transcoders.video.url },
    ];
    const called: typeof calledExpected = [];

    let hasApiKeys = true;
    mock.onPost('/support').reply(config => {
      if (!config.params['api-key'] && hasApiKeys) {
        hasApiKeys = false;
      }

      called.push({ url: config.url!, baseURL: config.baseURL! });
      return [200, true];
    });

    expect(await transcoder.supports(file!)).toBe(true);
    expect(called).toEqual(calledExpected);
    expect(hasApiKeys).toBe(true);
  });

  it('should not support media', async () => {
    const file = await Files.get(mediaFileId);
    mock
      .onPost('/support')
      .reply(config => [
        200,
        (config.url || '').indexOf(testConf.transcoders.video.url) !== -1,
      ]);

    expect(await transcoder.supports(file!)).toBe(false);
  });

  it('should transcode media', async () => {
    const file = await Files.get(mediaFileId);
    const expected = [
      {
        id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2890',
        output:
          'http://muxer/upload?api-key=muxer&id=a8a4e9d0-9639-4fcd-acc1-1703dc2b2890',
        end:
          'http://muxer/end?api-key=muxer&id=a8a4e9d0-9639-4fcd-acc1-1703dc2b2890&name=audio-sub&waiting=audio-sub%2Cvideo&notify=http%3A%2F%2Fnotify%2Fnotify%3Fapi-key%3Dnotify%26id%3Da8a4e9d0-9639-4fcd-acc1-1703dc2b2890',
        progress:
          'http://progress/progress?api-key=progress&id=a8a4e9d0-9639-4fcd-acc1-1703dc2b2890&name=audio-sub',
      },
      {
        id: 'a8a4e9d0-9639-4fcd-acc1-1703dc2b2890',
        output:
          'http://muxer/upload?api-key=muxer&id=a8a4e9d0-9639-4fcd-acc1-1703dc2b2890',
        end:
          'http://muxer/end?api-key=muxer&id=a8a4e9d0-9639-4fcd-acc1-1703dc2b2890&name=video&waiting=audio-sub%2Cvideo&notify=http%3A%2F%2Fnotify%2Fnotify%3Fapi-key%3Dnotify%26id%3Da8a4e9d0-9639-4fcd-acc1-1703dc2b2890',
        progress:
          'http://progress/progress?api-key=progress&id=a8a4e9d0-9639-4fcd-acc1-1703dc2b2890&name=video',
      },
    ];
    const submitted: typeof expected = [];
    mock.onPost('/support').reply(() => [200, true]);
    mock.onPut('/').reply(config => {
      submitted.push(JSON.parse(config.data));
      return [200, true];
    });

    await transcoder.transcode(file!);

    // @ts-ignore
    delete submitted[0].media;
    // @ts-ignore
    delete submitted[1].media;
    expect(submitted).toEqual(expected);
  });

  it('should clean all', async () => {
    let count = 0;

    mock.onDelete(/.*/).reply(() => {
      count++;
      return [200, true];
    });

    await transcoder.clean('124');
    expect(count).toBe(3);
  });
});
