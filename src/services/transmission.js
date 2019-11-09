const fs = require('fs');
const FormData = require('form-data');
const Torrents = require('./torrents');
const DuplicatedTorrent = require('../errors/duplicatedTorrent');
const api = require('../api/transmission');

module.exports = {
  uploadFile: async (filePath, host) => {
    const form = new FormData();
    form.append('torrent', fs.readFileSync(filePath), {
      filename: 'file.torrent',
      contentType: 'application/octet-stream',
      knownLength: 27570,
    });

    const {
      data: {
        data: { hash },
      },
    } = await api.upload.file({
      headers: form.getHeaders(),
      baseURL: host.transmissionServiceUrl,
      data: form.getBuffer(),
    });

    if (await Torrents.get(hash)) {
      throw new DuplicatedTorrent('Torrent is already uploaded');
    }

    /** @todo
    { hashString: '0f2a3adfe82e1c92b390cdcaaec3cdc0dd3ebfd7',
      id: 2,
      name: 'debian-10.1.0-amd64-netinst.iso' },
     */

    console.log('received', hash);
  },
  uploadMagnet: async (magnet, host) => {
    const {
      data: { data },
    } = await api.upload.magnet({
      baseURL: host.transmissionServiceUrl,
      data: { url: magnet },
    });
    console.log('magnet', data);
  },
  remove: async (hash, host) =>
    api.torrent.remove({
      baseURL: host.transmissionServiceUrl,
      routeParams: {
        hash,
      },
    }),
};
