import winston from 'winston';
import Sentry from 'winston-transport-sentry-node';

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
    new Sentry({
      sentry: {
        dsn: sentry.dsn,
        environment: app.env,
        debug: app.debug,
        tags: {
          service: app.service,
        },
      },
      level: sentry.level,
    })
  );
}

const loggerOptions = {
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { environment: app.env, service: app.service },
  transports,
};

const logger = winston.createLogger(loggerOptions);

export default logger;
