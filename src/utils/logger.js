import winston from 'winston';
import SentryWinstonTransport from '../services/SentryWinstonTransport';

import { app, sentry } from '../config';

const transports = [
  new winston.transports.Console({
    level: 'info',
    colorize: true,
  }),
];

if (app.env === 'local' && app.debug) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/lesgo.log',
    })
  );
}

if (sentry.enabled) {
  transports.push(
    new SentryWinstonTransport({
      dsn: sentry.dsn,
      level: sentry.level,
      config: {
        tags: {
          release: sentry.release,
          environment: app.env,
          service: app.service,
        },
      },
    })
  );
}

const loggerOptions = {
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {},
  transports,
};

const logger = winston.createLogger(loggerOptions);

export default logger;
