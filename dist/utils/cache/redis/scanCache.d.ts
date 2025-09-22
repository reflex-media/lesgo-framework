import { ElastiCacheRedisClientOptions } from '../../../types/aws';
/**
 * Scans the Redis cache for keys matching a given pattern.
 *
 * @param {string} pattern - The pattern to match keys against.
 * @param {ElastiCacheRedisClientOptions} clientOpts - Optional client options for the cache client.
 * @returns A promise that resolves when the value is retrieved from the cache.
 *
 * @throws {LesgoException} If there is an error retrieving the cache.
 *
 * @example
 * ```typescript
 * import { scanCache } from 'lesgo/utils/cache/redis';
 *
 * const pattern = 'getUser:byId:*';
 * // const pattern = 'getUser:*';
 *
 * const keys = await scanCache(pattern);
 * console.log(keys); // Array of cache keys returned from the scan operation
 * ```
 */
declare const scanCache: (pattern: string, clientOpts?: ElastiCacheRedisClientOptions) => Promise<string[]>;
export default scanCache;
