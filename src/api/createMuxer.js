const createApi = require('./createApi');
const defaultEndpoints = require('./muxer.json');

module.exports = (apiKey, baseURL) =>
  createApi({
    endpoints: defaultEndpoints,
    axiosDefault: { params: { 'api-key': apiKey }, baseURL, timeout: 20000 },
  });
