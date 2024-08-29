import { logger } from '../../utils';
import { singleton } from '../ElastiCacheRedisService/getElastiCacheRedisClient';

const FILE =
  'lesgo.services.ElastiCacheRedisService.disconnectElastiCacheRedisClient';

/**
 * Disconnects the ElastiCache Redis client.
 *
 * It is important to disconnect the ElastiCache Redis client
 * when it is no longer needed to prevent memory leaks and to free up resources,
 * especially for serverless applications on Lambda function.
 *
 * @returns {Promise<void>} A promise that resolves when the disconnection is completed.
 */
const disconnectElastiCacheRedisClient = async () => {
  const singletonConns = Object.keys(singleton);
  if (singletonConns.length === 0) {
    logger.debug(`${FILE}::NO_CONNECTIONS_TO_DISCONNECT`);
    return;
  }

  logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`, {
    singletonConns,
  });

  singletonConns.forEach(async singletonConn => {
    try {
      await singleton[singletonConn].quit();
      delete singleton[singletonConn];
      logger.debug(`${FILE}::COMPLETED`, { singletonConn });
    } catch (err) {
      logger.error(`${FILE}::ERROR`, { singletonConn, err });
    }
  });
};

export default disconnectElastiCacheRedisClient;
