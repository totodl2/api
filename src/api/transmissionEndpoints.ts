export default {
  upload: {
    file: {
      method: 'POST',
      path: '/torrent',
    },
    magnet: {
      method: 'POST',
      path: '/url',
    },
  },
  getFreeSpace: {
    method: 'GET',
    path: '/free',
  },
  torrent: {
    get: {
      method: 'GET',
      path: '/{hash}',
    },
    start: {
      method: 'POST',
      path: '/{hash}/start',
    },
    pause: {
      method: 'POST',
      path: '/{hash}/pause',
    },
    ratio: {
      method: 'POST',
      path: '/{hash}/ratio/{ratio}',
    },
    remove: {
      method: 'DELETE',
      path: '/{hash}',
    },
  },
};
