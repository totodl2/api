export type PersonType = {
  id: string;
  name: string;
  profilePath: string | null;
};

export type CrewType = {
  id: string;
  department: string;
  job: string;
  person: PersonType;
};

export type CastType = {
  id: string;
  character: string;
  order: number;
  person: PersonType;
};

export type ImageType = {
  aspectRatio: number;
  filePath: string;
  height: number;
  iso6391: string | null;
  voteAverage: number;
  voteCount: number;
  width: number;
};

export enum VideoTypes {
  TRAILER = 'TRAILER',
  TEASER = 'TEASER',
  CLIP = 'CLIP',
  FEATURETTE = 'FEATURETTE',
  BEHIND_THE_SCENES = 'BEHIND THE SCENES',
  BLOOPERS = 'BLOOPERS',
}

export type VideoType = {
  id: string;
  iso6391: string;
  iso31661: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: VideoType;
};

export type KeywordType = {
  id: string;
  name: string;
};

export type GenreType = {
  id: string;
  name: string;
};

export type ProductionCompanyType = {
  id: string;
  name: string;
};

export type LanguageType = {
  iso6391: string;
  name: string;
};

export type CountryType = {
  iso31661: string;
  name: string;
};

export enum MovieStatus {
  RUMORED = 'Rumored',
  PLANNED = 'Planned',
  IN_PRODUCTION = 'In Production',
  POST_PRODUCTION = 'Post Production',
  RELEASE = 'Released',
  CANCELED = 'Canceled',
}

export type CreditsType = {
  cast: CastType[];
  crew: CrewType[];
};

export type MovieType = {
  credits: CreditsType;
  id: string;
  adult: boolean;
  backdropPath: string | null;
  budget: number;
  genres: GenreType[];
  homepage: string | null;
  imdbId: string | null;
  originalLanguage: string;
  originalTitle: string;
  overview: string | null;
  popularity: number;
  posterPath: string | null;
  productionCompanies: ProductionCompanyType[];
  productionCountries: CountryType[];
  releaseDate: string;
  revenue: number;
  runtime: number | null;
  spokenLanguages: LanguageType[];
  status: MovieStatus;
  tagline: string | null;
  title: string;
  video: boolean;
  videos: VideoType[];
  voteAverage: number;
  voteCount: number;
  images: {
    backdrops: ImageType[];
    posters: ImageType[];
  };
  keywords: KeywordType[];
};

export type ExternalIdsType = {
  imdbId: string | null;
  freebaseMid: string | null;
  freebaseId: string | null;
  id: number;
  // tvrageId: number | null;
  // tvdbId: number | null;
  // facebookId: string | null;
  // instagramId: string | null;
  // twitterId: string | null;
};

export type NetworkType = {
  name: string;
  id: string;
};

export type EpisodeType = {
  id: string;
  airDate: string;
  episodeNumber: number;
  guestStars: CastType[];
  crew: CrewType[];
  name: string;
  overview: string;
  stillPath: string | null;
  voteAverage: number;
  voteCount: number;
};

export type SeasonType = {
  id: string;
  airDate: string;
  name: string;
  overview: string;
  posterPath: string;
  seasonNumber: number;
  credits: CreditsType;
  images: {
    backdrops: ImageType[];
    posters: ImageType[];
  };
  videos: VideoType[];
  episodes: EpisodeType[];
};

export type TvType = {
  backdropPath: string | null;
  episodeRunTime: number[];
  firstAirDare: string;
  genres: GenreType[];
  homepage: string;
  id: string;
  inProduction: boolean;
  languages: string[];
  lastAirDate: string;
  name: string;
  networks: NetworkType[];
  numberOfEpisodes: number;
  numberOfSeasons: number;
  originCountry: string[];
  originalLanguage: string;
  originalName: string;
  overview: string;
  popularity: number;
  posterPath: string | null;
  productionCompanies: ProductionCompanyType[];
  status: string;
  type: string;
  voteAverage: number;
  voteCount: number;
  videos: VideoType[];
  credits: CreditsType;
  images: {
    backdrops: ImageType[];
    posters: ImageType[];
  };
  keywords: KeywordType[];
  externalIds: ExternalIdsType;
  seasons: SeasonType[];
};
