import { ClientOptions } from '../../../types/aws';
import { getElastiCacheRedisClient } from '../../../services/ElastiCacheRedisService';

const getClient = (clientOpts?: ClientOptions) => {
  return getElastiCacheRedisClient(clientOpts);
};

export default getClient;
