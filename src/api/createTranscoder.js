const createApi = require('./createApi');
const defaultEndpoints = require('./transcoder.json');

module.exports = (apiKey, baseURL) =>
  createApi({
    endpoints: defaultEndpoints,
    axiosDefault: { params: { 'api-key': apiKey }, baseURL },
  });
