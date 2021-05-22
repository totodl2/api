export enum TranscodedElementTypes {
  SUBTITLES = 'sub',
  MEDIA = 'media',
}

type TranscodedElementType = {
  type: TranscodedElementTypes;
  title: string;
  lang?: string;
  filename: string;
  filepath: string;
};

export default TranscodedElementType;
