const createApi = require('./createApi');
const defaultEndpoints = require('./transmission.json');

module.exports = createApi({
  apiUrl: process.env.TRANSMISSION_SERVICE_API_URL,
  endpoints: defaultEndpoints,
});
