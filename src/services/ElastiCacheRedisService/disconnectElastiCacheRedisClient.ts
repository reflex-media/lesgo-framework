import { logger } from '../../utils';
import { singleton } from '../ElastiCacheRedisService/getElastiCacheRedisClient';

const FILE =
  'lesgo.services.ElastiCacheRedisService.disconnectElastiCacheRedisClient';

const disconnectElastiCacheRedisClient = async () => {
  logger.debug(`${FILE}::PREPARING_TO_DISCONNECT`, {
    singletonConns: Object.keys(singleton),
  });

  Object.keys(singleton).forEach(async singletonConn => {
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
