const Hosts = require('../../services/hosts');

module.exports = async () => {
  const hosts = await Hosts.getAll();

  return Promise.all(
    hosts.map(async host => ({
      id: host.id,
      name: host.name,
      success: await Hosts.refreshHost(host),
    })),
  );
};
