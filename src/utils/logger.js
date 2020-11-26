import app from 'Config/app'; // eslint-disable-line import/no-unresolved
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
