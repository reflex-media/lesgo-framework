import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import { LesgoException } from '../../exceptions';
import getElastiCacheRedisClient from './getElastiCacheRedisClient';

const FILE = 'lesgo.services.ElastiCacheRedis.deleteRedisCache';

const deleteRedisCache = async (key: string, clientOpts?: ClientOptions) => {
  const input = validateFields({ key }, [
    { key: 'key', type: 'string', required: true },
  ]);

  const client = await getElastiCacheRedisClient(clientOpts);
  let resp;

  try {
    resp = await client.del(input.key);
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, input });

    return resp;
  } catch (err) {
    throw new LesgoException(
      'Failed to delete redis cache',
      `${FILE}::DELETE_ERROR`,
      500,
      {
        err,
        input,
        clientOpts,
      }
    );
  }
};

export default deleteRedisCache;
