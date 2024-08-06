import { deleteRedisCache } from '../../../services/ElastiCacheRedisService';
const getCache = (key, clientOpts) => {
  return deleteRedisCache(key, clientOpts);
};
export default getCache;
