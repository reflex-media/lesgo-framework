import app from 'Config/app'; // eslint-disable-line import/no-unresolved
import sentry from 'Config/sentry'; // eslint-disable-line import/no-unresolved
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
      tags: {
        environment: app.env,
        application: app.service || app.name,
      },
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
