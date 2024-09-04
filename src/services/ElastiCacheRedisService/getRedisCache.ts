import { isEmpty, logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import { LesgoException } from '../../exceptions';
import getElastiCacheRedisClient from './getElastiCacheRedisClient';

const FILE = 'lesgo.services.ElastiCacheRedis.getRedisCache';

const getRedisCache = async (key: string, clientOpts?: ClientOptions) => {
  const input = validateFields({ key }, [
    { key: 'key', type: 'string', required: true },
  ]);

  const client = await getElastiCacheRedisClient(clientOpts);
  let resp;

  try {
    resp = await client.get(input.key);
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, input });
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

  try {
    if (isEmpty(resp) || !resp) return resp;
    const data = JSON.parse(resp);
    logger.debug(`${FILE}::DATA_IS_JSON`, { data });
    return data;
  } catch (e) {
    logger.debug(`${FILE}::DATA_NOT_JSON`, { resp });
    return resp;
  }
};

export default getRedisCache;
