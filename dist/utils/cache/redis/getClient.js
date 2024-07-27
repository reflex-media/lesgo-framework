import { getElastiCacheRedisClient } from '../../../services/ElastiCacheRedisService';
const getClient = clientOpts => {
  return getElastiCacheRedisClient(clientOpts);
};
export default getClient;
