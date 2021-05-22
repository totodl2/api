module.exports = {
  support: {
    method: 'POST',
    path: '/support',
  },
  cancel: {
    method: 'DELETE',
    path: '/{id}',
  },
  transcode: {
    method: 'PUT',
    path: '/',
  },
};
