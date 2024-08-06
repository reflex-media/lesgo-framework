import { ClientOptions } from '../../../types/aws';
import { deleteRedisCache } from '../../../services/ElastiCacheRedisService';

const getCache = (key: string, clientOpts?: ClientOptions) => {
  return deleteRedisCache(key, clientOpts);
};

export default getCache;
