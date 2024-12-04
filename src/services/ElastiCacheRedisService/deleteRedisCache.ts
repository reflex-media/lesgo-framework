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
  let resp;

  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  try {
    resp = await client.del(...keys);
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, keys });

    return resp;
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
