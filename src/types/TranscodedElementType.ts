export enum TranscodedElementTypes {
  SUBTITLES = 'sub',
  MEDIA = 'media',
}

type TranscodedElementType = {
  lang?: string;
  title: string;
  type: TranscodedElementTypes;
  url: string;
};

export default TranscodedElementType;
