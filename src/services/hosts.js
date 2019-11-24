const { Host, Sequelize } = require('../models');
const transmission = require('../api/transmission');

module.exports = {
  /**
   * @param {Number} id
   * @returns {Promise<Host|null>}
   */
  getOne: id => Host.findOne({ where: { id } }),
  /**
   * Upsert Host
   * @param {Number} data
   * @returns {Promise<File>}
   */
  upsert: async function create(id) {
    const [host] = await Host.findOrCreate({
      where: { id },
      defaults: { id },
    });

    return host;
  },
  /**
   * @returns {Promise<Host>}
   */
  getAll: () => Host.findAll(),
  /**
   * Select available host
   * @returns {Promise<Host|null>}
   */
  findAvailableHost: () =>
    Host.findOne({
      where: Sequelize.literal(
        '"spaceAvailable" - "spaceReserved" > 0 AND "unavailabilityDetectedAt" IS NULL',
      ),
      order: [['lastUploadAt', 'ASC']],
    }),
  /**
   * Refresh space available for a given host and flag host as unavailable if
   * we can't make API calls
   * @param {Host} host
   */
  refreshHost: async host => {
    try {
      const result = await transmission.getFreeSpace({
        baseURL: host.transmissionServiceUrl,
        timeout: 1000,
      });

      const spaceAvailable = result.data.data;

      if (spaceAvailable !== host.spaceAvailable) {
        host.set('spaceAvailable', spaceAvailable);
      }

      if (host.unavailabilityDetectedAt) {
        host.set('unavailabilityDetectedAt', null);
      }

      if (host.changed()) {
        await host.save();
      }

      return true;
    } catch (e) {
      host.set('unavailabilityDetectedAt', new Date());
      await host.save();
      return false;
    }
  },
};
