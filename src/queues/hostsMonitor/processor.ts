import Hosts from '../../services/hosts';

const processor = async () => {
  const hosts = await Hosts.getAll();

  return Promise.all(
    hosts.map(async host => ({
      id: host.id,
      name: host.name,
      success: await Hosts.refreshHost(host),
    })),
  );
};

export default processor;
