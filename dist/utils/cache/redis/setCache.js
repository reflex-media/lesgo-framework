import { setRedisCache } from '../../../services/ElastiCacheRedisService';
/**
 * Sets a value in the Redis cache.
 *
 * @param {string} key - The key to set in the cache.
 * @param {any} value - The value to set in the cache.
 * @param {SetRedisCacheOptions} opts - Optional settings for setting the cache.
 * @param {ClientOptions} clientOpts - Optional client options for connecting to Redis.
 * @returns A promise that resolves when the value is successfully set in the cache.
 *
 * @throws {LesgoException} If there is an error setting the cache.
 *
 * @example
 * ```typescript
 * import { setCache } from '@core/utils/cache/redis';
 *
 * const key = 'myKey';
 * const value = 'myValue';
 *
 * await setCache(key, value);
 * ```
 */
const setCache = (key, value, opts, clientOpts) => {
  return setRedisCache(key, value, opts, clientOpts);
};
export default setCache;
