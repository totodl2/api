const createApi = require('./createApi');
const defaultEndpoints = require('./transmissionEndpoints');

module.exports = createApi({
  endpoints: defaultEndpoints,
});
