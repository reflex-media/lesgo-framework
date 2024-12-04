import { ClientOptions } from '../../../types/aws';
import { deleteRedisCache } from '../../../services/ElastiCacheRedisService';

/**
 * Deletes the cache value from the Redis cache.
 *
 * @param {string | string[]} keys - The key(s) of the cache value to delete.
 * @param {ClientOptions} clientOpts - Optional client options for Redis connection.
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
const deleteCache = (keys: string | string[], clientOpts?: ClientOptions) => {
  return deleteRedisCache(keys, clientOpts);
};

export default deleteCache;
