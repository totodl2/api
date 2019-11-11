const createApi = require('./createApi');
const defaultEndpoints = require('./transmission.json');

module.exports = createApi({
  endpoints: defaultEndpoints,
});
