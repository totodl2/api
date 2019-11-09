const Hosts = require('../../services/hosts');

module.exports = async () => {
  console.log('Started');
  const hosts = await Hosts.getAll();

  const r = await Promise.all(
    hosts.map(async host => ({
      id: host.id,
      name: host.name,
      success: await Hosts.refreshHost(host),
    })),
  );

  console.log('Ended');
  return r;
};
