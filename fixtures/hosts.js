const entries = [
  {
    id: 1,
    name: 'nospace',
    spaceAvailable: 50,
    spaceReserved: 60,
    unavailabilityDetectedAt: '2019-11-07T22:05:51.323Z',
  },
  {
    id: 2,
    name: 'down',
    spaceAvailable: 50,
    spaceReserved: 0,
    unavailabilityDetectedAt: '2019-11-07T22:05:51.323Z',
  },
  {
    id: 3,
    name: 'up but has uploads',
    spaceAvailable: 50,
    spaceReserved: 0,
    lastUploadAt: '2019-11-07T22:05:51.323Z',
  },
  {
    id: 4,
    name: 'ok',
    spaceAvailable: 100,
    spaceReserved: 60,
  },
];

module.exports = entries.map(data => ({ model: 'Host', data }));
