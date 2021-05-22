/* eslint-disable camelcase */

declare function guessit(
  filename: string,
  options?: {
    advanced?: boolean;
    type?: string;
    config?: string;
    nameOnly?: boolean;
    dateYearFirst?: boolean;
    dateDayFirst?: boolean;
    allowedLanguages?: string[];
    allowedCountries?: string[];
    episodePreferNumber?: boolean;
    expectedTitle?: string;
    expectedGroup?: string;
  },
): {
  title: string;
  type: 'movie' | 'episode';
  year?: number;
  alternative_title?: string;
  source?: string;
  screen_size?: string;
  release_group?: string;
  container?: string;
  mimetype?: string;
  season?: number;
  episode?: number;
  episode_title?: string;
  color_depth?: string;
  other?: string;
  audio_channels?: string;
  video_codec?: string;
  video_profile?: string;
};
export = guessit;
