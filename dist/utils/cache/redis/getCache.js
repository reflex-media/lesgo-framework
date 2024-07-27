import { getRedisCache } from '../../../services/ElastiCacheRedisService';
const getCache = (key, clientOpts) => {
  return getRedisCache(key, clientOpts);
};
export default getCache;
