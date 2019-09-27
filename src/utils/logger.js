import winston from 'winston';
import Sentry from 'winston-transport-sentry-node';

import { app, sentry } from '../config';

const transports = [
  new winston.transports.Console({
    level: 'info',
    colorize: true,
  }),
];

const exceptionTransports = [new winston.transports.Console()];

/* istanbul ignore next */
if (app.env === 'local' && app.debug) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/logs.log',
    })
  );

  transports.push(
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    })
  );

  exceptionTransports.push(
    new winston.transports.File({
      filename: 'logs/exceptions.log',
    })
  );
}

/* istanbul ignore next */
if (sentry.enabled) {
  const sentryTransport = new Sentry({
    sentry: {
      dsn: sentry.dsn,
      environment: app.env,
      debug: app.debug,
      tags: {
        service: app.service,
      },
    },
    level: sentry.level,
  });

  transports.push(sentryTransport);
  exceptionTransports.push(sentryTransport);
}

const loggerOptions = {
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { environment: app.env, service: app.service },
  transports,
  exceptionHandlers: exceptionTransports,
};

const logger = winston.createLogger(loggerOptions);

export default logger;
