import { getElastiCacheRedisClient } from '../../../services/ElastiCacheRedisService';
/**
 * Retrieves a Redis client.
 *
 * This function will return a Redis client that is connected to the ElastiCache Redis cluster.
 * A new client will be created if one does not already exist. The client will be reused if it is already connected.
 * This is useful if you need to use the Redis Client functions directly.
 *
 * This function is not intended to be used directly.
 * Use the available `getCache`, `setCache`, and `deleteCache` functions instead.
 *
 * @param {ElastiCacheRedisClientOptions} clientOpts - Optional client options.
 * @returns A promise of with Redis client.
 *
 * @throws {LesgoException} If there is an error creating the client.
 *
 * @example
 * ```typescript
 * import { getClient } from 'lesgo/utils/cache/redis';
 *
 * const client = await getClient();
 *
 * const key = 'myKey';
 * const value = 'myValue';
 *
 * await client.set(key, value);
 * ```
 */
const getClient = clientOpts => {
  return getElastiCacheRedisClient(clientOpts);
};
export default getClient;
