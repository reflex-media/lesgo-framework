import { disconnectElastiCacheRedisClient } from '../../../services/ElastiCacheRedisService';
const disconnectCache = () => {
  return disconnectElastiCacheRedisClient();
};
export default disconnectCache;
