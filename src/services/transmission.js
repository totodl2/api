const fs = require('fs');
const FormData = require('form-data');
const Torrents = require('./torrents');
const api = require('../api/transmission');

module.exports = {
  uploadFile: async (filePath, host, userId) => {
    const form = new FormData();
    form.append('torrent', fs.readFileSync(filePath), 'file.torrent');

    const {
      data: {
        data: { hash, name },
      },
    } = await api.upload.file({
      headers: form.getHeaders(),
      baseURL: host.transmissionServiceUrl,
      data: form.getBuffer(),
    });

    return Torrents.upsert({
      userId,
      name,
      hostId: host.id,
      hash,
    });
  },
  uploadMagnet: async (magnet, host, userId) => {
    const {
      data: {
        data: { hash, name },
      },
    } = await api.upload.magnet({
      baseURL: host.transmissionServiceUrl,
      data: { url: magnet },
    });

    return Torrents.upsert(
      {
        userId,
        name,
        hostId: host.id,
        hash,
      },
      true,
    );
  },
  remove: async (hash, host) =>
    api.torrent.remove({
      baseURL: host.transmissionServiceUrl,
      routeParams: {
        hash,
      },
    }),
};
