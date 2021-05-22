import { Sequelize } from 'sequelize';
import { Host } from '../models';
import transmission, { TransmissionApiResult } from '../api/createTransmission';
import { CreateHostAttributes, HostInstance } from '../models/hosts';
import { TorrentInstance } from '../models/torrents';

const HostsService = {
  getOne: (id: number) => Host.findOne({ where: { id } }),

  /**
   * Upsert Host
   */
  upsert: async function create(id: number) {
    const [host] = await Host.findOrCreate({
      where: { id },
      defaults: { id, lastUploadAt: new Date() } as CreateHostAttributes,
    });

    return host;
  },
  /**
   * Mark new upload on host
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  markNewUpload: async (host: HostInstance, torrent: TorrentInstance) => {
    host.set('lastUploadAt', new Date());
    await host.save();
    return host;
  },

  getAll: () => Host.findAll(),

  /**
   * Select available host
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
   */
  refreshHost: async (host: HostInstance) => {
    try {
      const result = await transmission.getFreeSpace<
        TransmissionApiResult<number>
      >({
        baseURL: host.transmissionServiceUrl!,
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

export default HostsService;
module.exports = HostsService; // @todo: remove me
