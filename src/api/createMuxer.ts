import createApi, { TransformedEndpointsType } from './createApi';
import defaultEndpoints from './muxerEndpoints';

export type MuxerApiType = TransformedEndpointsType<typeof defaultEndpoints>;

export default (apiKey: string, baseURL: string): MuxerApiType =>
  createApi({
    endpoints: defaultEndpoints,
    axiosDefault: { params: { 'api-key': apiKey }, baseURL, timeout: 60000 },
  });
