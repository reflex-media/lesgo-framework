import { sentry as config } from '../config';

export const connectSentry = () => {
  // Leave to use process.env so that it can be removed from webpack build
  /* istanbul ignore else */
  if (process.env.SENTRY_BUNDLED) {
    // eslint-disable-next-line import/no-unresolved
    const Sentry = require('@sentry/node');
    Sentry.init({ dsn: config.dsn });
  }
};

export default connectSentry;
