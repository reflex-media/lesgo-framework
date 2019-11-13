import { app, sentry } from '../config';
import LoggerService from '../services/LoggerService';

const transports = [
  {
    logType: 'console',
    level:
      app.env === 'local' && /* istanbul ignore next */ app.debug
        ? /* istanbul ignore next */ 'debug'
        : 'info',
    config: {
      getCreatedAt: true,
    },
  },
];

/* istanbul ignore else */
if (sentry.enabled) {
  transports.push({
    logType: 'sentry',
    level: sentry.level,
    config: {
      dsn: sentry.dsn,
      tags: {
        release: sentry.release,
        environment: app.env,
        service: app.service,
      },
    },
  });
}

const loggerOptions = {
  defaultMeta: {},
  transports,
};

const logger = new LoggerService(loggerOptions);

export default logger;
