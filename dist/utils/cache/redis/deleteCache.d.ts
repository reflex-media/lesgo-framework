import { ElastiCacheRedisClientOptions } from '../../../types/aws';
/**
 * Deletes the cache value from the Redis cache.
 *
 * @param {string | string[]} keys - The key(s) of the cache value to delete.
 * @param {ElastiCacheRedisClientOptions} clientOpts - Optional client options for Redis connection.
 * @returns A promise that resolves to the deleted cache value.
 * @throws {LesgoException} If there is an error deleting the cache.
 *
 * @example
 * ```typescript
 * import { deleteCache } from 'lesgo/utils/cache/redis';
 *
 * const keys = 'myKey';
 * // const keys = ['key1', 'key2'];
 *
 * await deleteCache(keys);
 */
declare const deleteCache: (keys: string | string[], clientOpts?: ElastiCacheRedisClientOptions) => Promise<void>;
export default deleteCache;
