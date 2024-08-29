import appConfig from '../config/app';
import { LoggerService } from '../services';
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
/**
 * Logger module for handling application logs.
 *
 * @module logger
 *
 * @usage
 * ```typescript
 * import logger from './utils/logger';
 *
 * logger.error('This is an error message');
 * logger.warn('This is a warning message');
 * logger.info('This is an info message');
 * logger.debug('This is a debug message');
 * logger.notice('This is a notice message');
 * logger.log('info', 'This is a log message');
 * ```
 */
const logger = new LoggerService(loggerOptions);
export default logger;
