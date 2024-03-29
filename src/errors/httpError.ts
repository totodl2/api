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

class HttpError extends Error {
  public status: number | undefined;

  public violations: any[] | undefined;

  // @ts-ignore
  public message: string | undefined;

  /**
   * @param {Number} status
   * @param {String} [message]
   * @param {?Array} [violations]
   * @param {String} [name]
   */
  constructor(
    status?: number,
    message?: string,
    violations?: any[],
    name?: string,
  ) {
    super(message);
    this.status = status;
    this.name =
      name ||
      // @ts-ignore
      codes[status!] ||
      // @ts-ignore
      codes[`${(status || '').toString().substr(1)}xx`] ||
      'Unkown error';
    this.violations = violations;
    this.message = message;
  }
}

export default HttpError;
