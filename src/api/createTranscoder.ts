import createApi, { TransformedEndpointsType } from './createApi';
import defaultEndpoints from './transcoderEndpoints';

export type TranscoderApiType = TransformedEndpointsType<
  typeof defaultEndpoints
>;

export default (apiKey: string, baseURL: string) =>
  createApi({
    endpoints: defaultEndpoints,
    axiosDefault: { params: { 'api-key': apiKey }, baseURL, timeout: 60000 },
  });
