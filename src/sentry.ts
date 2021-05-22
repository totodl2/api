import { init } from '@sentry/node';

init({
  release: process.env.VERSION,
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENV || process.env.NODE_ENV,
});
