import { ClientOptions } from '../../../types/aws';
import { SetRedisCacheOptions } from '../../../services/ElastiCacheRedisService/setRedisCache';
declare const setCache: (key: string, value: any, opts?: SetRedisCacheOptions, clientOpts?: ClientOptions) => Promise<"OK">;
export default setCache;
