import { LoggerService } from '../services';
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
declare const logger: LoggerService;
export default logger;
