import { logger } from '../../utils';
import { ClientOptions } from '../../types/aws';
import { LesgoException } from '../../exceptions';
import getElastiCacheRedisClient from './getElastiCacheRedisClient';

const FILE = 'lesgo.services.ElastiCacheRedis.deleteRedisCache';

const deleteRedisCache = async (
  keys: string | string[],
  clientOpts?: ClientOptions
) => {
  const client = await getElastiCacheRedisClient(clientOpts);

  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  try {
    if (keys.length > 0) {
      for (const key of keys) {
        // Keys to be deleted individually due to using Redis Cluster and key may exist across different nodes
        // ioredis handles the routing of the key to the correct node automatically
        const resp = await client.del(key);
        logger.debug(`${FILE}::CACHE_KEY_DELETED`, { resp, key });
      }
    }

    logger.debug(`${FILE}::ALL_KEYS_DELETED`, { keys });
  } catch (err) {
    throw new LesgoException(
      'Failed to delete redis cache',
      `${FILE}::DELETE_ERROR`,
      500,
      {
        err,
        keys,
        clientOpts,
      }
    );
  }
};

export default deleteRedisCache;
