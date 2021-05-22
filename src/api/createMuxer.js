const createApi = require('./createApi');
const defaultEndpoints = require('./muxerEndpoints');

module.exports = (apiKey, baseURL) =>
  createApi({
    endpoints: defaultEndpoints,
    axiosDefault: { params: { 'api-key': apiKey }, baseURL, timeout: 60000 },
  });
