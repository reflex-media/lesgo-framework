// @ts-ignore
import app from 'config/app';
import LoggerService from '../services/LoggerService';

const transports = [
  {
    logType: 'console',
    level: /* istanbul ignore next */ app.debug ? 'debug' : 'info',
    config: {
      getCreatedAt: true,
      tags: {
        env: app.env,
        service: app.service || app.name,
      },
    },
  },
];

const loggerOptions = {
  defaultMeta: {},
  transports,
};

const logger = new LoggerService(loggerOptions);

export default logger;
