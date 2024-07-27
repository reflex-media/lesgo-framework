import { RDSAuroraMySQLProxyClientOptions } from '../../../types/aws';
import { SetRedisCacheOptions } from '../../../services/ElastiCacheRedisService/setRedisCache';
declare const setCache: (key: string, value: any, opts?: SetRedisCacheOptions, clientOpts?: RDSAuroraMySQLProxyClientOptions) => Promise<string | null>;
export default setCache;
