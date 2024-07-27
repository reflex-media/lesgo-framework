import { RDSAuroraMySQLProxyClientOptions } from '../../../types/aws';
import { getRedisCache } from '../../../services/ElastiCacheRedisService';

const getCache = (
  key: string,
  clientOpts?: RDSAuroraMySQLProxyClientOptions
) => {
  return getRedisCache(key, clientOpts);
};

export default getCache;
