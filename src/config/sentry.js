export default {
  enabled: process.env.SENTRY_ENABLED === 'true',
  dsn: process.env.SENTRY_DSN,
  // Minimal level for error reporting. Ref: https://github.com/winstonjs/winston#logging
  level: process.env.SENTRY_LEVEL || 'error',
  // Track release version and for sourcemaps reference
  release: process.env.SENTRY_RELEASE || `${process.env.APP_ENV}-master`,
};
