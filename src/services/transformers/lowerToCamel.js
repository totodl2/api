const transformKey = key =>
  key.replace(/_([^_])/g, (match, letter) => letter.toUpperCase());

/* eslint-disable no-param-reassign */
const lowerToCamel = data => {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(value => lowerToCamel(value));
  }

  if (typeof data === 'object') {
    return Object.entries(data).reduce((prev, [key, value]) => {
      prev[transformKey(key)] = lowerToCamel(value);
      return prev;
    }, {});
  }

  return data;
};

module.exports = lowerToCamel;
