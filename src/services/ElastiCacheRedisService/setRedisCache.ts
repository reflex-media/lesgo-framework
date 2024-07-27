import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import { LesgoException } from '../../exceptions';
import getElastiCacheRedisClient from './getElastiCacheRedisClient';

const FILE = 'lesgo.services.ElastiCacheRedis.setRedisCache';

export interface SetRedisCacheOptions {
  EX?: number; // Expiry time in seconds
  NX?: boolean; // Only set the key if it does not already exist
}

const setRedisCache = async (
  key: string,
  value: any,
  opts?: SetRedisCacheOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields({ key, value }, [
    { key: 'key', type: 'string', required: true },
    { key: 'value', type: 'any', required: true },
  ]);

  opts = {
    EX: 300, // defaults to 5 min expiry if not defined
    ...opts,
  };

  const client = await getElastiCacheRedisClient(clientOpts);

  try {
    const resp = await client.set(input.key, input.value);
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, input, value });

    await client.disconnect();
    logger.debug(`${FILE}::CLIENT_DISCONNECTED`);

    return resp;
  } catch (err) {
    throw new LesgoException(
      'Failed to set redis cache',
      `${FILE}::SET_ERROR`,
      500,
      {
        err,
        input,
        value,
        opts,
        clientOpts,
      }
    );
  }
};

export default setRedisCache;
