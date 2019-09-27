import logger from './utils/logger';

// withMeta is initialized in the request middlewares
logger.withMeta = logger.child({ abc: 'asd' });
