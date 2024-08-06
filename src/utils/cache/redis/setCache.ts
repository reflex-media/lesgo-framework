import { ClientOptions } from '../../../types/aws';
import { setRedisCache } from '../../../services/ElastiCacheRedisService';
import { SetRedisCacheOptions } from '../../../services/ElastiCacheRedisService/setRedisCache';

const setCache = (
  key: string,
  value: any,
  opts?: SetRedisCacheOptions,
  clientOpts?: ClientOptions
) => {
  return setRedisCache(key, value, opts, clientOpts);
};

export default setCache;
