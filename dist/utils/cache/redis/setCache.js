import { setRedisCache } from '../../../services/ElastiCacheRedisService';
const setCache = (key, value, opts, clientOpts) => {
  return setRedisCache(key, value, opts, clientOpts);
};
export default setCache;
