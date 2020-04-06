const Sentry = require('@sentry/node');

Sentry.init({
  release: process.env.VERSION,
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENV || process.env.NODE_ENV,
});

module.exports = Sentry;
