const axios = require('axios');
const formUrlEncode = require('form-urlencoded');

const createFetcher = (defaultConf = {}) => (
  path,
  endpoint,
  { data, ...callerConf } = {},
) => {
  const baseURL = callerConf.baseURL || defaultConf.baseURL;
  const overloadedConf = { headers: {} };

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
    method: endpoint.method,
    baseURL,
    url: path,
  });
};

function extractParameters(endpoint) {
  const regex = /\{([a-z0-9\-_]+)\}/gi;
  const parameters = [];
  let matches = regex.exec(endpoint);
  while (matches) {
    parameters.push(matches[1]);
    matches = regex.exec(endpoint);
  }
  return parameters;
}

const createCaller = (fetcher, { path: routePath, ...endpoint }, fullName) => {
  const parameters = extractParameters(routePath);

  return ({ routeParams, ...axiosConf } = {}) => {
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

const createTree = (fetcher, endpoints, previousName = '') =>
  Object.entries(endpoints).reduce((prev, [name, endpoint]) => {
    const fullName = (previousName ? `${previousName}.` : '') + name;

    if (!endpoint.method) {
      prev[name] = createTree(fetcher, endpoint, fullName); // eslint-disable-line
    } else {
      prev[name] = createCaller(fetcher, endpoint, fullName); // eslint-disable-line
    }

    return prev;
  }, {});

/**
 * Define your endpoints variable with object like :
 * const schema = {
 *    "endpointA": {
 *      "method": "POST",
 *      "content-type": "x-www-form-urlencoded",
 *      "path": "/my/{var}/path"
 *    },
 *    "nested": [
 *      "get": {
 *        "method": "GET",
 *        "path": "/nested/{id}"
 *      },
 *      "add": {
 *        "method": "POST",
 *        "path": "/nested/{id}"
 *      }
 *      ... infinite nesting possible
 *    ]
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
 *
 * @param {Object} endpoints
 * @param {Object} [axiosDefault]
 */
const createApi = ({ endpoints, axiosDefault }) =>
  createTree(createFetcher(axiosDefault), endpoints);

module.exports = createApi;
