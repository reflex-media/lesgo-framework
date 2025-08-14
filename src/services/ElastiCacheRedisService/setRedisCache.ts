import { logger, validateFields } from '../../utils';
import { ClientOptions } from '../../types/aws';
import { LesgoException } from '../../exceptions';
import getElastiCacheRedisClient from './getElastiCacheRedisClient';

const FILE = 'lesgo.services.ElastiCacheRedis.setRedisCache';

export interface SetRedisCacheOptions {
  EX?: number; // Expiry time in seconds
}

const setRedisCache = async (
  key: string,
  value: any,
  opts?: SetRedisCacheOptions,
  clientOpts?: ClientOptions
) => {
  const input = validateFields({ key, value }, [
    { key: 'key', type: 'string', required: true },
    // Can accept empty values to caching
    { key: 'value', type: 'any', required: false },
  ]);

  opts = {
    ...opts,
    EX: opts?.EX ?? 300, // defaults to 5 min expiry if not defined
  };

  const client = await getElastiCacheRedisClient(clientOpts);

  input.value =
    typeof input.value === 'object' ? JSON.stringify(input.value) : input.value;

  try {
    // @ts-ignore
    const resp = await client.set(input.key, input.value, 'EX', opts.EX);
    logger.debug(`${FILE}::RECEIVED_RESPONSE`, { resp, input, value });

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
