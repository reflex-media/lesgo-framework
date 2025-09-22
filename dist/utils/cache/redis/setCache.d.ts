import { ElastiCacheRedisClientOptions } from '../../../types/aws';
import { SetRedisCacheOptions } from '../../../services/ElastiCacheRedisService/setRedisCache';
/**
 * Sets a value in the Redis cache.
 *
 * @param {string} key - The key to set in the cache.
 * @param {any} value - The value to set in the cache.
 * @param {SetRedisCacheOptions} opts - Optional settings for setting the cache.
 * @param {ElastiCacheRedisClientOptions} clientOpts - Optional client options for connecting to Redis.
 * @returns A promise that resolves when the value is successfully set in the cache.
 *
 * @throws {LesgoException} If there is an error setting the cache.
 *
 * @example
 * ```typescript
 * import { setCache } from 'lesgo/utils/cache/redis';
 *
 * const key = 'myKey';
 * const value = 'myValue';
 *
 * await setCache(key, value);
 * ```
 */
declare const setCache: (key: string, value: any, opts?: SetRedisCacheOptions, clientOpts?: ElastiCacheRedisClientOptions) => Promise<"OK">;
export default setCache;
