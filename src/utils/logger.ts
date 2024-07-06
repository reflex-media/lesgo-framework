import appConfig from '../config/app';
import LoggerService from '../services/LoggerService';

const transports = [
  {
    logType: 'console',
    level: appConfig.debug ? 'debug' : 'info',
    config: {
      getCreatedAt: true,
      tags: {
        env: appConfig.env,
        service: appConfig.name,
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
