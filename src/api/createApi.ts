import axios, { AxiosPromise, AxiosRequestConfig, Method } from 'axios';
import formUrlEncode from 'form-urlencoded';

type EndpointConfigurationType = {
  method: Method | string;
  contentType?: string;
  path: string;
};

type EndpointsConfigurationType = {
  [key: string]: EndpointConfigurationType | EndpointsConfigurationType;
};

type StrKeyObject = { [key: string]: any };

export type CallerType<T extends EndpointConfigurationType> = <
  ResponseType,
  DataType extends StrKeyObject = {},
  RouteParamsType extends StrKeyObject = {},
  ParamsType extends StrKeyObject = {}
>(
  conf: AxiosRequestConfig & {
    routeParams?: RouteParamsType;
    data?: DataType;
    params?: ParamsType;
    paramsSerializer?: (params: ParamsType) => string;
  },
) => AxiosPromise<ResponseType>;

export type TransformedEndpointsType<T extends {}> = {
  [key in keyof T]: T[key] extends {}
    ? T[key] extends EndpointConfigurationType
      ? CallerType<T[key]>
      : TransformedEndpointsType<T[key]>
    : never;
};

type FetcherType = ReturnType<typeof createFetcher>;

const createFetcher = (defaultConf: AxiosRequestConfig = {}) => (
  path: string,
  endpoint: Omit<EndpointConfigurationType, 'path'>,
  { data, ...callerConf }: AxiosRequestConfig = {},
) => {
  const baseURL = callerConf.baseURL || defaultConf.baseURL;
  const overloadedConf: AxiosRequestConfig = { headers: {} };

  if (endpoint.contentType === 'x-www-form-urlencoded') {
    overloadedConf.headers['content-type'] =
      'application/x-www-form-urlencoded; charset=UTF-8';
    if (data !== undefined) {
      overloadedConf.data = formUrlEncode(data);
    }
  }

  return axios({
    ...defaultConf,
    ...callerConf,
    ...overloadedConf,
    headers: {
      ...(defaultConf.headers || {}),
      ...(callerConf.headers || {}),
      ...overloadedConf.headers,
    },
    params: {
      ...(defaultConf.params || {}),
      ...(callerConf.params || {}),
      ...(overloadedConf.params || {}),
    },
    data: overloadedConf.data || data,
    method: endpoint.method as Method,
    baseURL,
    url: path,
  });
};

function extractParameters(endpoint: string) {
  const regex = /\{([a-z0-9\-_]+)\}/gi;
  const parameters = [];
  let matches = regex.exec(endpoint);
  while (matches) {
    parameters.push(matches[1]);
    matches = regex.exec(endpoint);
  }
  return parameters;
}

const createCaller = (
  fetcher: FetcherType,
  { path: routePath, ...endpoint }: EndpointConfigurationType,
  fullName: string,
) => {
  const parameters = extractParameters(routePath);

  return ({
    routeParams = {},
    ...axiosConf
  }: AxiosRequestConfig & { routeParams?: StrKeyObject } = {}) => {
    let path = routePath;
    for (let i = 0; i < parameters.length; i++) {
      const parameter = routeParams[parameters[i]];
      if (!parameter) {
        throw new Error(
          `Parameter "${parameters[i]}" must be defined for route ${fullName}`,
        );
      }
      path = path.replace(`{${parameters[i]}}`, parameter.toString());
    }
    return fetcher(path, endpoint, axiosConf);
  };
};

const createTree = <GivenEndpointsConfType extends EndpointsConfigurationType>(
  fetcher: FetcherType,
  endpoints: GivenEndpointsConfType,
  previousName = '',
): TransformedEndpointsType<GivenEndpointsConfType> =>
  Object.entries(endpoints).reduce(
    (prev, [name, endpoint]) => {
      const fullName = (previousName ? `${previousName}.` : '') + name;

      if (!endpoint.method) {
        // eslint-disable-next-line no-param-reassign
        prev[name] = createTree(
          fetcher,
          endpoint as EndpointsConfigurationType,
          fullName,
        );
      } else {
        // eslint-disable-next-line no-param-reassign
        prev[name] = createCaller(
          fetcher,
          endpoint as EndpointConfigurationType,
          fullName,
        );
      }

      return prev;
    },
    {} as any,
  ) as TransformedEndpointsType<GivenEndpointsConfType>;

/**
 * Define your endpoints variable with object like :
 * const schema = {
 *    "endpointA": {
 *      "method": "POST",
 *      "contentType": "x-www-form-urlencoded",
 *      "path": "/my/{var}/path"
 *    },
 *    "nested": {
 *      "get": {
 *        "method": "GET",
 *        "path": "/nested/{id}"
 *      },
 *      "add": {
 *        "method": "POST",
 *        "path": "/nested/{id}"
 *      }
 *      ... infinite nesting possible
 *    }
 * }
 *
 * then call createApi, it will generate an object like your schema :
 * const api = createApi(schema, { baseURL: 'http://api' });
 * api.endpointA({
 *    routeParams: { var: 123 },
 *    data: { email: 'a@la.com', password: 'b'},
 *    ...axiosConf
 * }):
 * api.nested.get({ routeParams: { id: 2 }});
 */
const createApi = <GivenEndpointsConfType extends EndpointsConfigurationType>({
  endpoints,
  axiosDefault,
}: {
  endpoints: GivenEndpointsConfType;
  axiosDefault?: AxiosRequestConfig;
}) => createTree(createFetcher(axiosDefault), endpoints);

module.exports = createApi; // @todo remove me
export default createApi;
