export default {
  enabled: process.env.SENTRY_ENABLED === 'true',
  dsn: process.env.SENTRY_DSN,
  level: process.env.SENTRY_LEVEL || 'error',
};
