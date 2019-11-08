const codes = {
  '4xx': 'Client Error',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: "I'm a teapot",
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  '5xx': 'Server error',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  510: 'Not Extended',
  511: 'Network Authentication Required',
};

module.exports = class extends Error {
  /**
   * Retapper ça, avec comme proto
   * status, errors, name, message
   * le name est auto généré par le status
   * errors sert a transmettre des informations complémentaires sur l'erreur
   * repasser partout et intégrer la gestion des errorHandlers validator
   * @param {*} message
   * @param {*} status
   */
  constructor(status, message, errors, name) {
    super(message);
    this.status = status;
    this.name =
      name ||
      codes[status] ||
      codes[`${status.toString().substr(1)}xx`] ||
      'Unkown error';
    this.errors = errors;
    this.message = message;
  }
};
