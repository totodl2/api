import createApi, { TransformedEndpointsType } from './createApi';
import defaultEndpoints from './transmissionEndpoints';

export type TransmissionApiResult<T> = {
  success: boolean;
  data: T;
};

export type TransmissionApiType = TransformedEndpointsType<
  typeof defaultEndpoints
>;

export default createApi({
  endpoints: defaultEndpoints,
});
