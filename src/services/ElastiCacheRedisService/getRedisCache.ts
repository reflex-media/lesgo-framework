import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import { LesgoException } from '../../exceptions';
import getElastiCacheRedisClient from './getElastiCacheRedisClient';

const FILE = 'lesgo.services.ElastiCacheRedis.getRedisCache';

const getRedisCache = async (key: string, clientOpts?: ClientOptions) => {
  const input = validateFields({ key }, [
    { key: 'key', type: 'string', required: true },
  ]);

  const client = await getElastiCacheRedisClient(clientOpts);

  try {
    const resp = await client.get(input.key);
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, input });

    return resp;
  } catch (err) {
    throw new LesgoException(
      'Failed to get redis cache',
      `${FILE}::GET_ERROR`,
      500,
      {
        err,
        input,
        clientOpts,
      }
    );
  }
};

export default getRedisCache;
